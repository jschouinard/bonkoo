import type { BonkooState } from '../types';

const KEY = 'bonkoo:state:v1';

// Migration légère : ajoute les champs V2 manquants sur un state V1.5 sérialisé
// (jeux, niveau_requis, heure_coucher, notifications_actives, série v2).
// Évite les `state.jeux.find(...) is undefined` qui font crash le reducer silencieusement.
const migrate = (raw: any): BonkooState => {
  raw.jeux = Array.isArray(raw.jeux) ? raw.jeux : [];
  raw.récompenses = Array.isArray(raw.récompenses)
    ? raw.récompenses.map((r: any) => ({ ...r, niveau_requis: typeof r.niveau_requis === 'number' ? r.niveau_requis : 1 }))
    : [];
  raw.famille = {
    ...raw.famille,
    heure_coucher: raw.famille?.heure_coucher ?? '19:30',
    notifications_actives: raw.famille?.notifications_actives ?? true,
  };
  // V2 Streak : on retire les champs disparus, on garde le strict minimum
  raw.séries = Array.isArray(raw.séries)
    ? raw.séries.map((s: any) => ({
        enfant_id: s.enfant_id,
        longueur_actuelle: typeof s.longueur_actuelle === 'number' ? s.longueur_actuelle : 0,
        dernière_date_active: s.dernière_date_active ?? s.dernière_date,
        paliers_atteints: Array.isArray(s.paliers_atteints) ? s.paliers_atteints : [],
      }))
    : [];
  // Behavior V2 : retrait du champ routine
  raw.comportements = Array.isArray(raw.comportements)
    ? raw.comportements.map((b: any) => {
        const { routine, ...rest } = b;
        void routine;
        return rest;
      })
    : [];
  return raw as BonkooState;
};

export const loadState = (): BonkooState | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveState = (state: BonkooState): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode — silent fail in proto */
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* silent */
  }
};
