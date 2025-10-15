import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ApiKey } from '../../models/api-key';
import {
  keyAdd,
  keyAddError,
  keyAddSuccess,
  keyDelete,
  keyDeleteError,
  keyDeleteSuccess,
  keysLoad,
  keysLoadError,
  keysLoadSuccess,
  keysReset,
  keyUpdate,
  keyUpdateError,
  keyUpdateSuccess,
} from './actions';

export interface State {
  apiKeys: EntityState<ApiKey>;
  loaded: boolean;
}

export const API_KEYS_KEY = 'api-keys';

export const adapter: EntityAdapter<ApiKey> = createEntityAdapter<ApiKey>();

const initialState: State = {
  apiKeys: adapter.getInitialState(),
  loaded: false,
};

export const apiKeysReducer = createReducer(
  initialState,
  on(keysLoad, (state: State) => state),
  on(keysLoadError, (state: State) => state),
  on(keysLoadSuccess, (state: State, action: ReturnType<typeof keysLoadSuccess>) => ({
    ...state,
    apiKeys: adapter.addMany(action.apiKeys, state.apiKeys),
    loaded: true,
  })),
  on(keyAdd, (state: State) => state),
  on(keyAddError, (state: State) => state),
  on(keyAddSuccess, (state: State, action: ReturnType<typeof keyAddSuccess>) => ({
    ...state,
    apiKeys: adapter.addOne(action.apiKey, state.apiKeys),
  })),
  on(keyDelete, (state: State) => state),
  on(keyDeleteError, (state: State) => state),
  on(keyDeleteSuccess, (state: State, action: ReturnType<typeof keyDeleteSuccess>) => ({
    ...state,
    apiKeys: adapter.removeOne(action.id, state.apiKeys),
  })),
  on(keyUpdate, (state: State) => state),
  on(keyUpdateError, (state: State) => state),
  on(keyUpdateSuccess, (state: State, action: ReturnType<typeof keyUpdateSuccess>) => ({
    ...state,
    apiKeys: adapter.updateOne(action.apiKey, state.apiKeys),
  })),
  on(keysReset, () => initialState),
);
