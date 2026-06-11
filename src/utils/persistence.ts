import type { BonkooState } from '../types';

const KEY = 'bonkoo:state:v1';

export const loadState = (): BonkooState | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BonkooState;
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
