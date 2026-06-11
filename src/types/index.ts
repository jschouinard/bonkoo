// Modèle de données — voir PRD §A.5
// Tout est en mémoire ; le grand livre (TransactionPoints) est la source de vérité.

export type ID = string;

export type Role = 'admin' | 'co-parent';
export type ModeInterface = 'visuel' | 'texte';
export type BehaviorType = 'tâche' | 'consigne';
export type Size = 'petite' | 'moyenne' | 'grande';
export type Recurrence = 'quotidienne' | 'jours_précis' | 'unique';
export type DayOfWeek = 'lun' | 'mar' | 'mer' | 'jeu' | 'ven' | 'sam' | 'dim';
export type Routine = 'matin' | 'midi' | 'soir' | 'libre';
export type Severity = 'légère' | 'modérée' | 'sévère';
export type RewardType = 'privilège' | 'sortie' | 'objet' | 'écran' | 'autre';
export type OccurrenceStatus = 'à_faire' | 'déclaré' | 'approuvé' | 'refusé' | 'expiré';
export type ExchangeStatus = 'demandé' | 'approuvé' | 'refusé' | 'remis';
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
  nip: string; // démo
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
  icône: string; // emoji obligatoire
  taille: Size;
  valeur_points: number;
  récurrence: Recurrence;
  jours_actifs: DayOfWeek[];
  routine?: Routine; // matin / midi / soir / libre — groupe d'affichage dans le kanban
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
  date: string; // YYYY-MM-DD
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
  actif: boolean;
}

export interface Exchange {
  id: ID;
  enfant_id: ID;
  récompense_id: ID;
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
  valeur_signée: number;
  solde_après: number;
  créé_par?: ID;
  note?: string;
  créé_le: string;
}

export interface Streak {
  enfant_id: ID;
  longueur_actuelle: number;
  meilleure_longueur: number;
  // Série "jours sans malus" — protège la valorisation positive
  longueur_sans_malus: number;
  meilleure_sans_malus: number;
  dernière_date?: string;
  paliers_atteints: number[];
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
  séries: Streak[];
  notifications: Notification[];
  onboarding_terminé: boolean;
}
