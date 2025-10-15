import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { OzaSupply } from '../../models/oza-supply';
import {
  keyNotExists,
  suppliesLoad,
  suppliesLoadError,
  suppliesLoadSuccess,
  suppliesReset,
} from './actions';

export interface State {
  supplies: EntityState<OzaSupply>;
  loaded: boolean;
  success: boolean;
}

export const SUPPLIES_KEY = 'supplies';

export const adapter: EntityAdapter<OzaSupply> = createEntityAdapter<OzaSupply>();

const initialState: State = {
  loaded: false,
  success: false,
  supplies: adapter.getInitialState(),
};

export const suppliesReducer = createReducer(
  initialState,
  on(suppliesLoad, (state: State) => state),
  on(keyNotExists, (state: State) => ({
    ...state,
    loaded: true,
    success: false,
    supplies: adapter.addMany([], state.supplies),
  })),
  on(suppliesLoadError, (state: State) => ({
    ...state,
    loaded: true,
    success: false,
    supplies: adapter.addMany([], state.supplies),
  })),
  on(suppliesLoadSuccess, (state: State, action: ReturnType<typeof suppliesLoadSuccess>) => ({
    ...state,
    loaded: true,
    success: true,
    supplies: adapter.addMany(action.supplies, state.supplies),
  })),
  on(suppliesReset, () => initialState),
);
