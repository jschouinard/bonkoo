import type { BonkooState, Occurrence, PointTransaction, Exchange } from '../types';
import type { Action } from './actions';
import { buildEmptyState, buildSeedState, systemBehaviors, systemMalus } from '../data/seed';
import { nowISO, todayISO, uid, dayOfWeek } from '../utils/helpers';

const computeBalance = (state: BonkooState, childId: string): number =>
  state.transactions
    .filter(t => t.enfant_id === childId)
    .reduce((s, t) => s + t.valeur_signée, 0);

// Crée une transaction et retourne le solde_après
const addTx = (
  state: BonkooState,
  enfant_id: string,
  type: PointTransaction['type'],
  valeur_signée: number,
  référence_id?: string,
  créé_par?: string,
  note?: string,
): { state: BonkooState; tx: PointTransaction } => {
  const balance = computeBalance(state, enfant_id) + valeur_signée;
  const floor = state.famille.plancher_solde;
  let final = valeur_signée;
  if (!state.famille.solde_négatif_autorisé && balance < floor) {
    // Clamp pour ne pas violer le plancher
    final = valeur_signée + (floor - balance);
    if (final === 0 && valeur_signée < 0) {
      // Ne rien faire si on ne peut pas appliquer le malus / dépense
      return { state, tx: null as unknown as PointTransaction };
    }
  }
  const newBalance = computeBalance(state, enfant_id) + final;
  const tx: PointTransaction = {
    id: uid('t-'),
    enfant_id,
    type,
    référence_id,
    valeur_signée: final,
    solde_après: newBalance,
    créé_par,
    note,
    créé_le: nowISO(),
  };
  return {
    state: { ...state, transactions: [...state.transactions, tx] },
    tx,
  };
};

const ensureChildBehaviorForToday = (state: BonkooState): BonkooState => {
  const today = todayISO();
  const dow = dayOfWeek(today);
  const newOccs: Occurrence[] = [];
  state.assignations.forEach(a => {
    const b = state.comportements.find(c => c.id === a.comportement_id);
    if (!b || !b.actif) return;
    if (b.récurrence === 'jours_précis' && !b.jours_actifs.includes(dow)) return;
    if (b.récurrence === 'unique' && state.occurrences.some(o => o.comportement_id === b.id && o.enfant_id === a.enfant_id)) return;
    const exists = state.occurrences.some(
      o => o.comportement_id === b.id && o.enfant_id === a.enfant_id && o.date === today,
    );
    if (!exists) {
      newOccs.push({
        id: uid('o-'),
        comportement_id: b.id,
        enfant_id: a.enfant_id,
        date: today,
        statut: 'à_faire',
      });
    }
  });
  return newOccs.length ? { ...state, occurrences: [...state.occurrences, ...newOccs] } : state;
};

export const initialState = (): BonkooState => buildSeedState();

export const reducer = (state: BonkooState, action: Action): BonkooState => {
  switch (action.type) {
    case 'RESET':
      return buildEmptyState();
    case 'LOAD_SEED':
      return buildSeedState();

    case 'SIGNUP': {
      const p = { ...action.parent, id: uid('p-'), famille_id: state.famille.id, créé_le: nowISO() };
      return {
        ...state,
        famille: { ...state.famille, nom: action.foyerNom },
        parents: [p],
      };
    }

    case 'ADD_CHILD': {
      const c = { ...action.child, id: uid('k-'), famille_id: state.famille.id, créé_le: nowISO() };
      return {
        ...state,
        enfants: [...state.enfants, c],
        séries: [...state.séries, {
          enfant_id: c.id,
          longueur_actuelle: 0,
          meilleure_longueur: 0,
          longueur_sans_malus: 0,
          meilleure_sans_malus: 0,
          paliers_atteints: [],
        }],
      };
    }

    case 'REMOVE_CHILD':
      return {
        ...state,
        enfants: state.enfants.filter(c => c.id !== action.childId),
        assignations: state.assignations.filter(a => a.enfant_id !== action.childId),
      };

    case 'ACTIVATE_SYSTEM_BEHAVIOR': {
      const sys = systemBehaviors.find(b => b.id === action.sysBehaviorId);
      if (!sys) return state;
      // Si déjà activé, ne pas dupliquer
      if (state.comportements.some(b => b.nom === sys.nom)) return state;
      const newBehavior = {
        ...sys,
        id: 'fb-' + sys.id + '-' + uid(''),
        famille_id: state.famille.id,
        est_modèle_système: false,
      };
      return { ...state, comportements: [...state.comportements, newBehavior] };
    }

    case 'TOGGLE_FAMILY_BEHAVIOR':
      return {
        ...state,
        comportements: state.comportements.map(b =>
          b.id === action.behaviorId ? { ...b, actif: !b.actif } : b,
        ),
      };

    case 'CREATE_BEHAVIOR': {
      const b = {
        ...action.behavior,
        id: uid('fb-'),
        famille_id: state.famille.id,
        est_modèle_système: false,
        actif: true,
        créé_le: nowISO(),
      };
      return { ...state, comportements: [...state.comportements, b] };
    }

    case 'UPDATE_BEHAVIOR':
      return {
        ...state,
        comportements: state.comportements.map(b =>
          b.id === action.behaviorId ? { ...b, ...action.patch } : b,
        ),
      };

    case 'ASSIGN_BEHAVIOR': {
      const others = state.assignations.filter(a => a.comportement_id !== action.behaviorId);
      const newOnes = action.childIds.map(cid => ({
        id: uid('a-'),
        comportement_id: action.behaviorId,
        enfant_id: cid,
      }));
      return { ...state, assignations: [...others, ...newOnes] };
    }

    case 'CREATE_REWARD': {
      const r = { ...action.reward, id: uid('r-'), famille_id: state.famille.id, actif: true };
      return { ...state, récompenses: [...state.récompenses, r] };
    }

    case 'UPDATE_REWARD':
      return {
        ...state,
        récompenses: state.récompenses.map(r =>
          r.id === action.rewardId ? { ...r, ...action.patch } : r,
        ),
      };

    case 'ACTIVATE_SYSTEM_MALUS': {
      const sys = systemMalus.find(m => m.id === action.sysMalusId);
      if (!sys) return state;
      if (state.malus.some(m => m.nom === sys.nom)) return state;
      return {
        ...state,
        malus: [...state.malus, { ...sys, id: 'fm-' + sys.id, famille_id: state.famille.id, est_modèle_système: false }],
      };
    }

    case 'CREATE_MALUS': {
      const m = {
        ...action.malus,
        id: uid('fm-'),
        famille_id: state.famille.id,
        est_modèle_système: false,
        actif: true,
      };
      return { ...state, malus: [...state.malus, m] };
    }

    case 'SET_NIP':
      return { ...state, famille: { ...state.famille, nip: action.nip } };

    case 'FINISH_ONBOARDING':
      return { ...state, onboarding_terminé: true };

    case 'UPDATE_FAMILY':
      return { ...state, famille: { ...state.famille, ...action.patch } };

    case 'ENSURE_TODAY_OCCURRENCES':
      return ensureChildBehaviorForToday(state);

    case 'DECLARE_OCCURRENCE':
      return {
        ...state,
        occurrences: state.occurrences.map(o =>
          o.id === action.occurrenceId && o.statut === 'à_faire'
            ? { ...o, statut: 'déclaré', déclaré_le: nowISO() }
            : o,
        ),
      };

    case 'APPROVE_OCCURRENCE': {
      const occ = state.occurrences.find(o => o.id === action.occurrenceId);
      if (!occ || occ.statut !== 'déclaré') return state;
      const behavior = state.comportements.find(b => b.id === occ.comportement_id);
      if (!behavior) return state;
      const valeur = action.valeur ?? behavior.valeur_points;
      const txType = behavior.type === 'tâche' ? 'gain_tâche' : 'gain_consigne';
      const { state: s1, tx } = addTx(state, occ.enfant_id, txType, valeur, occ.id, action.parentId);
      if (!tx) return state;
      return {
        ...s1,
        occurrences: s1.occurrences.map(o =>
          o.id === occ.id
            ? { ...o, statut: 'approuvé', valeur_créditée: valeur, traité_par: action.parentId, traité_le: nowISO() }
            : o,
        ),
      };
    }

    case 'REJECT_OCCURRENCE':
      return {
        ...state,
        occurrences: state.occurrences.map(o =>
          o.id === action.occurrenceId
            ? { ...o, statut: 'refusé', valeur_créditée: 0, traité_par: action.parentId, traité_le: nowISO(), raison_refus: action.raison }
            : o,
        ),
      };

    case 'APPLY_MALUS': {
      const m = state.malus.find(x => x.id === action.malusId);
      if (!m) return state;
      const { state: s1 } = addTx(state, action.childId, 'malus', m.valeur_points, m.id, action.parentId, m.nom);
      // Reset de la série "sans malus" pour cet enfant
      return {
        ...s1,
        séries: s1.séries.map(s =>
          s.enfant_id === action.childId
            ? { ...s, longueur_sans_malus: 0 }
            : s,
        ),
      };
    }

    case 'REQUEST_REDEEM': {
      const r = state.récompenses.find(x => x.id === action.rewardId);
      if (!r) return state;
      const balance = computeBalance(state, action.childId);
      if (balance < r.coût_points) return state;
      const e: Exchange = {
        id: uid('e-'),
        enfant_id: action.childId,
        récompense_id: r.id,
        coût_points: r.coût_points,
        statut: 'demandé',
        demandé_le: nowISO(),
      };
      return { ...state, échanges: [...state.échanges, e] };
    }

    case 'APPROVE_REDEEM': {
      const e = state.échanges.find(x => x.id === action.exchangeId);
      if (!e || e.statut !== 'demandé') return state;
      const { state: s1, tx } = addTx(state, e.enfant_id, 'dépense_récompense', -e.coût_points, e.id, action.parentId);
      if (!tx) return state;
      return {
        ...s1,
        échanges: s1.échanges.map(x =>
          x.id === e.id ? { ...x, statut: 'approuvé', traité_par: action.parentId, traité_le: nowISO() } : x,
        ),
      };
    }

    case 'REJECT_REDEEM':
      return {
        ...state,
        échanges: state.échanges.map(x =>
          x.id === action.exchangeId
            ? { ...x, statut: 'refusé', traité_par: action.parentId, traité_le: nowISO() }
            : x,
        ),
      };

    case 'MARK_DELIVERED':
      return {
        ...state,
        échanges: state.échanges.map(x =>
          x.id === action.exchangeId ? { ...x, statut: 'remis' } : x,
        ),
      };

    default:
      return state;
  }
};
