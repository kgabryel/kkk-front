import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Season } from '../../models/season';
import {
  seasonAdd,
  seasonAddError,
  seasonAddSuccess,
  seasonDelete,
  seasonDeleteError,
  seasonDeleteSuccess,
  seasonsLoad,
  seasonsLoadError,
  seasonsLoadSuccess,
  seasonsReset,
  seasonUpdate,
  seasonUpdateError,
  seasonUpdateSuccess,
} from './actions';

export interface State {
  seasons: EntityState<Season>;
  loaded: boolean;
}

export const SEASONS_KEY = 'seasons';

export const adapter: EntityAdapter<Season> = createEntityAdapter<Season>();

const initialState: State = {
  loaded: false,
  seasons: adapter.getInitialState(),
};

export const seasonsReducer = createReducer(
  initialState,
  on(seasonsLoad, (state: State) => state),
  on(seasonsLoadError, (state: State) => state),
  on(seasonsLoadSuccess, (state: State, action: ReturnType<typeof seasonsLoadSuccess>) => ({
    ...state,
    loaded: true,
    seasons: adapter.addMany(action.seasons, state.seasons),
  })),
  on(seasonAdd, (state: State) => state),
  on(seasonAddError, (state: State) => state),
  on(seasonAddSuccess, (state: State, action: ReturnType<typeof seasonAddSuccess>) => ({
    ...state,
    seasons: adapter.addOne(action.season, state.seasons),
  })),
  on(seasonDelete, (state: State) => state),
  on(seasonDeleteError, (state: State) => state),
  on(seasonDeleteSuccess, (state: State, action: ReturnType<typeof seasonDeleteSuccess>) => ({
    ...state,
    seasons: adapter.removeOne(action.id, state.seasons),
  })),
  on(seasonUpdate, (state: State) => state),
  on(seasonUpdateError, (state: State) => state),
  on(seasonUpdateSuccess, (state: State, action: ReturnType<typeof seasonUpdateSuccess>) => ({
    ...state,
    seasons: adapter.updateOne(action.season, state.seasons),
  })),
  on(seasonsReset, () => initialState),
);
