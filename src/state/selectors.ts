import type { BonkooState, Occurrence, Game, Reward } from '../types';
import { todayISO } from '../utils/helpers';
import { SEUILS_NIVEAUX } from '../types';

// ── Compteurs dérivés du grand livre ───────────────────────────────────

export const balanceOf = (state: BonkooState, childId: string): number =>
  state.transactions.filter(t => t.enfant_id === childId).reduce((s, t) => s + t.valeur_signée, 0);

// Progression (D6) = somme des seuls gain_* + bonus_série.
// Ne baisse jamais : ni malus ni dépense ne l'affectent.
export const progressionOf = (state: BonkooState, childId: string): number =>
  state.transactions
    .filter(t => t.enfant_id === childId && (t.type === 'gain_tâche' || t.type === 'gain_consigne' || t.type === 'bonus_série'))
    .reduce((s, t) => s + t.valeur_signée, 0);

// Niveau dérivé de la progression. Paliers : 0 · 75 · 200 · 400 · 700 · 1100 puis +500/niveau.
export const levelOf = (progression: number): number => {
  let niveau = 1;
  for (let i = 1; i < SEUILS_NIVEAUX.length; i++) {
    if (progression >= SEUILS_NIVEAUX[i]!) niveau = i + 1;
    else return niveau;
  }
  // Au-delà du dernier seuil défini : +1 niveau tous les +500 pts
  const last = SEUILS_NIVEAUX[SEUILS_NIVEAUX.length - 1]!;
  if (progression > last) niveau += Math.floor((progression - last) / 500);
  return niveau;
};

// ── Série v2 (D7) — gel, jamais reset ──────────────────────────────────
export const streakOf = (state: BonkooState, childId: string) => {
  const found = state.séries.find(s => s.enfant_id === childId);
  return {
    enfant_id: childId,
    longueur_actuelle: found?.longueur_actuelle ?? 0,
    dernière_date_active: found?.dernière_date_active,
    paliers_atteints: found?.paliers_atteints ?? [],
  };
};

// ── Modèle JEU ──────────────────────────────────────────────────────────

// D2 : un seul jeu non terminé/refusé par enfant.
export const jeuActif = (state: BonkooState, childId: string): Game | undefined =>
  state.jeux.find(
    j =>
      j.enfant_id === childId &&
      (j.statut === 'en_attente_validation' ||
        j.statut === 'actif' ||
        j.statut === 'récompense_réclamée'),
  );

// Jauge du jeu : 0..1, fraction du coût atteinte par le solde courant.
export const jaugeJeu = (state: BonkooState, childId: string): { ratio: number; manque: number; cible: Reward | undefined; game: Game | undefined } => {
  const game = jeuActif(state, childId);
  if (!game) return { ratio: 0, manque: 0, cible: undefined, game: undefined };
  const cible = state.récompenses.find(r => r.id === game.récompense_id);
  if (!cible) return { ratio: 0, manque: 0, cible: undefined, game };
  const bal = balanceOf(state, childId);
  const ratio = cible.coût_points > 0 ? Math.min(1, Math.max(0, bal / cible.coût_points)) : 0;
  const manque = Math.max(0, cible.coût_points - bal);
  return { ratio, manque, cible, game };
};

// D6 : récompenses dont niveau_requis ≤ niveau actuel
export const recompensesDeverrouillees = (state: BonkooState, childId: string): Reward[] => {
  const niveau = levelOf(progressionOf(state, childId));
  return state.récompenses.filter(r => r.actif && r.niveau_requis <= niveau);
};

// ── Boucle quotidienne ─────────────────────────────────────────────────

export const todayOccurrences = (state: BonkooState, childId: string): Occurrence[] => {
  const today = todayISO();
  return state.occurrences.filter(o => o.enfant_id === childId && o.date === today);
};

// File parent (D1 P3) : déclarations + créations de jeu + réclamations
export const allPendingApprovals = (state: BonkooState): Occurrence[] =>
  state.occurrences.filter(o => o.statut === 'déclaré');

export const pendingGameCreations = (state: BonkooState): Game[] =>
  state.jeux.filter(j => j.statut === 'en_attente_validation');

export const pendingGameClaims = (state: BonkooState): Game[] =>
  state.jeux.filter(j => j.statut === 'récompense_réclamée');

export const pendingRedeems = (state: BonkooState) =>
  state.échanges.filter(e => e.statut === 'demandé');

// ── Lookups ────────────────────────────────────────────────────────────

export const behaviorById = (state: BonkooState, id: string) =>
  state.comportements.find(b => b.id === id);

export const rewardById = (state: BonkooState, id: string) =>
  state.récompenses.find(r => r.id === id);

export const childById = (state: BonkooState, id: string) =>
  state.enfants.find(c => c.id === id);

export const gameById = (state: BonkooState, id: string) =>
  state.jeux.find(j => j.id === id);

export const assignedBehaviorsFor = (state: BonkooState, childId: string) =>
  state.comportements.filter(
    b =>
      b.actif &&
      state.assignations.some(a => a.comportement_id === b.id && a.enfant_id === childId),
  );

// Malus appliqués aujourd'hui à un enfant (affichés en bandeau séparé sous le tableau, brief E4)
export const todayMalusFor = (state: BonkooState, childId: string) => {
  const today = todayISO();
  return state.transactions
    .filter(t => t.enfant_id === childId && t.type === 'malus' && t.créé_le.slice(0, 10) === today)
    .map(t => ({
      tx: t,
      malus: state.malus.find(m => m.id === t.référence_id),
    }));
};
