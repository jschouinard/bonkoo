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
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'UPDATE_FAMILY'; patch: Partial<Family> }

  // Boucle quotidienne
  | { type: 'ENSURE_TODAY_OCCURRENCES' }
  | { type: 'DECLARE_OCCURRENCE'; occurrenceId: string }
  | { type: 'APPROVE_OCCURRENCE'; occurrenceId: string; valeur?: number; parentId: string }
  | { type: 'REJECT_OCCURRENCE'; occurrenceId: string; raison?: string; parentId: string }
  | { type: 'APPLY_MALUS'; childId: string; malusId: string; parentId: string }

  // Récompenses
  | { type: 'REQUEST_REDEEM'; childId: string; rewardId: string }
  | { type: 'APPROVE_REDEEM'; exchangeId: string; parentId: string }
  | { type: 'REJECT_REDEEM'; exchangeId: string; parentId: string }
  | { type: 'MARK_DELIVERED'; exchangeId: string }

  // Système
  | { type: 'RESET' }
  | { type: 'LOAD_SEED' };
