import type { BonkooState, Occurrence } from '../types';
import { todayISO } from '../utils/helpers';

export const balanceOf = (state: BonkooState, childId: string): number =>
  state.transactions.filter(t => t.enfant_id === childId).reduce((s, t) => s + t.valeur_signée, 0);

export const progressionOf = (state: BonkooState, childId: string): number =>
  state.transactions
    .filter(t => t.enfant_id === childId && (t.type === 'gain_tâche' || t.type === 'gain_consigne' || t.type === 'bonus_série'))
    .reduce((s, t) => s + t.valeur_signée, 0);

export const streakOf = (state: BonkooState, childId: string) => {
  const found = state.séries.find(s => s.enfant_id === childId);
  return {
    enfant_id: childId,
    longueur_actuelle: found?.longueur_actuelle ?? 0,
    meilleure_longueur: found?.meilleure_longueur ?? 0,
    longueur_sans_malus: found?.longueur_sans_malus ?? 0,
    meilleure_sans_malus: found?.meilleure_sans_malus ?? 0,
    dernière_date: found?.dernière_date,
    paliers_atteints: found?.paliers_atteints ?? [],
  };
};

export const todayOccurrences = (state: BonkooState, childId: string): Occurrence[] => {
  const today = todayISO();
  return state.occurrences.filter(o => o.enfant_id === childId && o.date === today);
};

export const allPendingApprovals = (state: BonkooState): Occurrence[] =>
  state.occurrences.filter(o => o.statut === 'déclaré');

export const pendingRedeems = (state: BonkooState) =>
  state.échanges.filter(e => e.statut === 'demandé');

export const behaviorById = (state: BonkooState, id: string) =>
  state.comportements.find(b => b.id === id);

export const rewardById = (state: BonkooState, id: string) =>
  state.récompenses.find(r => r.id === id);

export const childById = (state: BonkooState, id: string) =>
  state.enfants.find(c => c.id === id);

export const assignedBehaviorsFor = (state: BonkooState, childId: string) =>
  state.comportements.filter(
    b =>
      b.actif &&
      state.assignations.some(a => a.comportement_id === b.id && a.enfant_id === childId),
  );

// Malus appliqués aujourd'hui à un enfant (à afficher dans le kanban)
export const todayMalusFor = (state: BonkooState, childId: string) => {
  const today = todayISO();
  return state.transactions
    .filter(t => t.enfant_id === childId && t.type === 'malus' && t.créé_le.slice(0, 10) === today)
    .map(t => ({
      tx: t,
      malus: state.malus.find(m => m.id === t.référence_id),
    }));
};
