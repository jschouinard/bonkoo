import { createContext, useContext, useEffect, useReducer, type ReactNode, type Dispatch } from 'react';
import type { BonkooState } from '../types';
import type { Action } from './actions';
import { reducer } from './reducer';
import { buildSeedState } from '../data/seed';
import { loadState, saveState } from '../utils/persistence';

type Ctx = { state: BonkooState; dispatch: Dispatch<Action> };
const BonkooContext = createContext<Ctx | null>(null);

export const BonkooProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState() ?? buildSeedState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    dispatch({ type: 'ENSURE_TODAY_OCCURRENCES' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <BonkooContext.Provider value={{ state, dispatch }}>{children}</BonkooContext.Provider>;
};

export const useBonkoo = (): Ctx => {
  const ctx = useContext(BonkooContext);
  if (!ctx) throw new Error('useBonkoo must be used within BonkooProvider');
  return ctx;
};
