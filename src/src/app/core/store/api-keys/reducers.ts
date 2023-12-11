import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {ApiKey} from '../../models/api-key';

export interface State {
  apiKeys: EntityState<ApiKey>;
  loaded: boolean;
}

export const API_KEYS_KEY = 'api-keys';

export const adapter: EntityAdapter<ApiKey> = createEntityAdapter<ApiKey>();

const initialState: State = {
  apiKeys: adapter.getInitialState(),
  loaded: false
};

export const apiKeysReducer = createReducer(
  initialState,
  on(actions.keysLoad, state => state),
  on(actions.keysLoadError, state => state),
  on(actions.keysLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    apiKeys: adapter.addMany(action.apiKeys, state.apiKeys)
  })),
  on(actions.keyAdd, state => state),
  on(actions.keyAddError, state => state),
  on(actions.keyAddSuccess, (state, action) => ({
    ...state,
    apiKeys: adapter.addOne(action.apiKey, state.apiKeys)
  })),
  on(actions.keyDelete, state => state),
  on(actions.keyDeleteError, state => state),
  on(actions.keyDeleteSuccess, (state, action) => ({
    ...state,
    apiKeys: adapter.removeOne(action.id, state.apiKeys)
  })),
  on(actions.keyUpdate, state => state),
  on(actions.keyUpdateError, state => state),
  on(actions.keyUpdateSuccess, (state, action) => ({
    ...state,
    apiKeys: adapter.updateOne(action.apiKey, state.apiKeys)
  })),
  on(actions.keysReset, () => initialState)
);
