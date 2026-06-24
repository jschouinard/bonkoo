import type {
  Behavior,
  Child,
  Family,
  Malus,
  Reward,
  Parent,
} from '../types';

export type Action =
  // Onboarding
  | { type: 'SIGNUP'; parent: Omit<Parent, 'id' | 'famille_id' | 'créé_le'>; foyerNom: string }
  | { type: 'ADD_CHILD'; child: Omit<Child, 'id' | 'famille_id' | 'créé_le'> }
  | { type: 'UPDATE_CHILD'; childId: string; patch: Partial<Child> }
  | { type: 'REMOVE_CHILD'; childId: string }
  | { type: 'ACTIVATE_SYSTEM_BEHAVIOR'; sysBehaviorId: string }
  | { type: 'TOGGLE_FAMILY_BEHAVIOR'; behaviorId: string }
  | { type: 'CREATE_BEHAVIOR'; behavior: Omit<Behavior, 'id' | 'famille_id' | 'est_modèle_système' | 'actif' | 'créé_le'> }
  | { type: 'UPDATE_BEHAVIOR'; behaviorId: string; patch: Partial<Behavior> }
  | { type: 'ASSIGN_BEHAVIOR'; behaviorId: string; childIds: string[] }
  | { type: 'CREATE_REWARD'; reward: Omit<Reward, 'id' | 'famille_id' | 'actif'> }
  | { type: 'UPDATE_REWARD'; rewardId: string; patch: Partial<Reward> }
  | { type: 'ACTIVATE_SYSTEM_MALUS'; sysMalusId: string }
  | { type: 'CREATE_MALUS'; malus: Omit<Malus, 'id' | 'famille_id' | 'est_modèle_système' | 'actif'> }
  | { type: 'SET_NIP'; nip: string }
  | { type: 'FINISH_ONBOARDING' }  // ⚠ V2 : fait l'auto-assign de tous les bonkoo × enfants
                                   // SYNCHRONE dans le reducer (corrige le setTimeout V1)
  | { type: 'UPDATE_FAMILY'; patch: Partial<Family> }

  // Boucle quotidienne
  | { type: 'ENSURE_TODAY_OCCURRENCES' }
  | { type: 'DECLARE_OCCURRENCE'; occurrenceId: string }
  | { type: 'APPROVE_OCCURRENCE'; occurrenceId: string; valeur?: number; parentId: string }
  | { type: 'REJECT_OCCURRENCE'; occurrenceId: string; raison?: string; parentId: string }
  | { type: 'APPLY_MALUS'; childId: string; malusId: string; parentId: string }

  // ── V2 : cycle de vie d'un JEU ─────────────────────────────────────────
  // D1 : l'enfant crée le jeu → en_attente_validation, va dans la file P3
  | { type: 'CREATE_GAME'; childId: string; rewardId: string }
  // D1 : le parent approuve → actif
  | { type: 'APPROVE_GAME'; gameId: string; parentId: string }
  // D1 : le parent refuse → l'enfant rechoisit (D3 : points conservés)
  | { type: 'REJECT_GAME'; gameId: string; parentId: string; raison?: string }
  // D4 : l'enfant réclame sa récompense (solde ≥ coût + geste explicite)
  | { type: 'CLAIM_REWARD'; gameId: string }
  // D4 : parent approuve la réclamation → dépense + jeu terminé (D3 : surplus conservé)
  | { type: 'APPROVE_CLAIM'; gameId: string; parentId: string }
  // D4 : parent refuse la réclamation (rare, p.ex. erreur enfant)
  | { type: 'REJECT_CLAIM'; gameId: string; parentId: string }

  // Récompenses libres (avant V2 / hors jeu) — conservé
  | { type: 'REQUEST_REDEEM'; childId: string; rewardId: string }
  | { type: 'APPROVE_REDEEM'; exchangeId: string; parentId: string }
  | { type: 'REJECT_REDEEM'; exchangeId: string; parentId: string }
  | { type: 'MARK_DELIVERED'; exchangeId: string }

  // Notifications (O2)
  | { type: 'MARK_NOTIFICATION_READ'; notificationId: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'CLEAR_NOTIFICATIONS' }

  // Système
  | { type: 'RESET' }
  | { type: 'LOAD_SEED' };
