// Modèle de données v2 — CIBLE pour Claude Code
// Delta vs v1 (types/index.ts) : voir claude-code-brief.md §1.
// Le grand livre (PointTransaction) reste la SEULE source de vérité ;
// solde, progression, niveau, jauge de jeu et série sont DÉRIVÉS (selectors).
// Pas de migration nécessaire : pas d'utilisateurs réels, on régénère le seed.

export type ID = string;

export type Role = 'admin' | 'co-parent';
export type ModeInterface = 'visuel' | 'texte';
export type BehaviorType = 'tâche' | 'consigne';
export type Size = 'petite' | 'moyenne' | 'grande';
export type Recurrence = 'quotidienne' | 'jours_précis' | 'unique';
export type DayOfWeek = 'lun' | 'mar' | 'mer' | 'jeu' | 'ven' | 'sam' | 'dim';
export type Severity = 'légère' | 'modérée' | 'sévère';
export type RewardType = 'privilège' | 'sortie' | 'objet' | 'écran' | 'autre';
export type OccurrenceStatus = 'à_faire' | 'déclaré' | 'approuvé' | 'refusé' | 'expiré';
export type ExchangeStatus = 'demandé' | 'approuvé' | 'refusé' | 'remis';

// ── NOUVEAU : le JEU (pivot v2) ─────────────────────────────────────────────
// Un jeu = une récompense cible choisie par l'enfant + ses bonkoo récurrents
// (assignés par le parent). UN SEUL jeu non-terminé par enfant (invariant).
export type GameStatus =
  | 'en_attente_validation' // créé par l'enfant, dans la file P3 (D1)
  | 'actif'                 // approuvé par le parent
  | 'récompense_réclamée'   // solde ≥ coût + geste explicite de l'enfant (D4)
  | 'terminé'               // rachat approuvé ; surplus conservé au solde (D3)
  | 'refusé';               // le parent a refusé la récompense → l'enfant rechoisit

export interface Game {
  id: ID;
  enfant_id: ID;
  récompense_id: ID;
  statut: GameStatus;
  créé_le: string;     // ISO
  validé_le?: string;
  réclamé_le?: string;
  terminé_le?: string;
  raison_refus?: string;
}

export type TxType =
  | 'gain_tâche'
  | 'gain_consigne'
  | 'bonus_série'
  | 'malus'
  | 'dépense_récompense'
  | 'ajustement';

export interface Family {
  id: ID;
  nom: string;
  pays: string;
  langue: string;
  plancher_solde: number;
  solde_négatif_autorisé: boolean;
  nip: string;
  heure_coucher: string;          // ← NOUVEAU (D8) « 19:30 » — bascule de journée
  notifications_actives: boolean; // ← NOUVEAU (O2)
  créé_le: string;
}

export interface Parent {
  id: ID;
  famille_id: ID;
  prénom: string;
  courriel: string;
  rôle: Role;
  créé_le: string;
}

export interface Child {
  id: ID;
  famille_id: ID;
  prénom: string;
  avatar: string; // emoji
  mode_interface: ModeInterface;
  créé_le: string;
}

export interface Behavior {
  id: ID;
  famille_id: ID | null; // null = modèle système
  type: BehaviorType;
  nom: string;
  icône: string; // emoji OBLIGATOIRE (reconnaissance pré-lecture)
  taille: Size;
  valeur_points: number;
  récurrence: Recurrence;
  jours_actifs: DayOfWeek[];
  // v2 : plus de champ `routine` — les onglets matin/midi/soir sont hors MVP
  fenêtre_début?: string;
  fenêtre_fin?: string;
  est_modèle_système: boolean;
  actif: boolean;
  créé_le: string;
}

export interface BehaviorAssignment {
  id: ID;
  comportement_id: ID;
  enfant_id: ID;
}

export interface Occurrence {
  id: ID;
  comportement_id: ID;
  enfant_id: ID;
  date: string; // « journée Bonkoo » : bascule à heure_coucher, pas à minuit (D8)
  statut: OccurrenceStatus;
  déclaré_le?: string;
  traité_par?: ID;
  traité_le?: string;
  valeur_créditée?: number;
  raison_refus?: string;
}

export interface Malus {
  id: ID;
  famille_id: ID | null;
  nom: string;
  icône: string;
  gravité: Severity;
  valeur_points: number;
  est_modèle_système: boolean;
  actif: boolean;
}

export interface Reward {
  id: ID;
  famille_id: ID;
  nom: string;
  icône: string;
  type: RewardType;
  coût_points: number;
  niveau_requis: number; // ← NOUVEAU (D6) défaut 1 ; pré-rempli par palier, éditable
  actif: boolean;
}

export interface Exchange {
  id: ID;
  enfant_id: ID;
  récompense_id: ID;
  jeu_id?: ID; // ← NOUVEAU : la réclamation d'un jeu crée un Exchange
  coût_points: number;
  statut: ExchangeStatus;
  demandé_le: string;
  traité_par?: ID;
  traité_le?: string;
}

export interface PointTransaction {
  id: ID;
  enfant_id: ID;
  type: TxType;
  référence_id?: ID;
  jeu_id?: ID; // ← NOUVEAU : rattachement au jeu (historique)
  valeur_signée: number;
  solde_après: number;
  créé_par?: ID;
  note?: string;
  créé_le: string;
}

// ── Série v2 (D7) : ne casse JAMAIS, elle se gèle ───────────────────────────
// À chaque bascule de journée : ≥1 bonkoo approuvé → longueur_actuelle + 1 ;
// sinon inchangée. Jamais remise à zéro. Le malus n'a aucun effet.
// (v2 supprime « jours sans malus » : concept retiré de l'UI.)
export interface Streak {
  enfant_id: ID;
  longueur_actuelle: number;
  dernière_date_active?: string; // dernière journée comptée
  paliers_atteints: number[];    // pour les bonus_série déjà versés
}

export interface Notification {
  id: ID;
  destinataire_type: 'parent' | 'enfant';
  destinataire_id: ID;
  type: string;
  contenu: string;
  lu: boolean;
  créé_le: string;
}

// ── Constantes d'économie (D6) — seul endroit où vivent les chiffres ────────
// Paliers de progression → niveau. progressionOf = somme des gain_* + bonus_série.
export const SEUILS_NIVEAUX = [0, 75, 200, 400, 700, 1100] as const; // ensuite +500/niveau
// Taille de récompense → niveau requis suggéré (pré-remplissage, éditable)
export const NIVEAU_REQUIS_SUGGÉRÉ = { petite: 1, moyenne: 2, grande: 3, épique: 4 } as const;

export interface BonkooState {
  famille: Family;
  parents: Parent[];
  enfants: Child[];
  comportements: Behavior[];
  assignations: BehaviorAssignment[];
  occurrences: Occurrence[];
  malus: Malus[];
  récompenses: Reward[];
  échanges: Exchange[];
  transactions: PointTransaction[];
  jeux: Game[]; // ← NOUVEAU
  séries: Streak[];
  notifications: Notification[];
  onboarding_terminé: boolean;
}
