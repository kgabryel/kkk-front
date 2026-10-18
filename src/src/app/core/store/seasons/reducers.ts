import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {Season} from '../../models/season';
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
  seasonUpdateSuccess
} from './actions';

export interface State {
  seasons: EntityState<Season>;
  loaded: boolean;
}

export const SEASONS_KEY = 'seasons';

export const adapter: EntityAdapter<Season> = createEntityAdapter<Season>();

const initialState: State = {
  seasons: adapter.getInitialState(),
  loaded: false
};

export const seasonsReducer = createReducer(
  initialState,
  on(seasonsLoad, state => state),
  on(seasonsLoadError, state => state),
  on(seasonsLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    seasons: adapter.addMany(action.seasons, state.seasons)
  })),
  on(seasonAdd, state => state),
  on(seasonAddError, state => state),
  on(seasonAddSuccess, (state, action) => ({
    ...state,
    seasons: adapter.addOne(action.season, state.seasons)
  })),
  on(seasonDelete, state => state),
  on(seasonDeleteError, state => state),
  on(seasonDeleteSuccess, (state, action) => ({
    ...state,
    seasons: adapter.removeOne(action.id, state.seasons)
  })),
  on(seasonUpdate, state => state),
  on(seasonUpdateError, state => state),
  on(seasonUpdateSuccess, (state, action) => ({
    ...state,
    seasons: adapter.updateOne(action.season, state.seasons)
  })),
  on(seasonsReset, () => initialState)
);
