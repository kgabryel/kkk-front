import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {keyNotExists, suppliesLoad, suppliesLoadError, suppliesLoadSuccess, suppliesReset} from './actions';
import {OzaSupply} from '../../models/oza-supply';

export interface State {
  supplies: EntityState<OzaSupply>;
  loaded: boolean;
  success: boolean;
}

export const SUPPLIES_KEY = 'supplies';

export const adapter: EntityAdapter<OzaSupply> = createEntityAdapter<OzaSupply>();

const initialState: State = {
  supplies: adapter.getInitialState(),
  loaded: false,
  success: false
};

export const suppliesReducer = createReducer(
  initialState,
  on(suppliesLoad, state => state),
  on(keyNotExists, state => ({
    ...state,
    loaded: true,
    success: false,
    supplies: adapter.addMany([], state.supplies)
  })),
  on(suppliesLoadError, state => ({
    ...state,
    loaded: true,
    success: false,
    supplies: adapter.addMany([], state.supplies)
  })),
  on(suppliesLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    success: true,
    supplies: adapter.addMany(action.supplies, state.supplies)
  })),
  on(suppliesReset, () => initialState)
);
