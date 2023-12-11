import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Timer} from '../../models/timer';
import {createReducer, on} from '@ngrx/store';
import {
  timerAdd,
  timerAddError,
  timerAddSuccess,
  timerDelete,
  timerDeleteError,
  timerDeleteSuccess,
  timersLoad,
  timersLoadError,
  timersLoadSuccess,
  timersReset,
  timerUpdate,
  timerUpdateError,
  timerUpdateSuccess
} from './actions';

export interface State {
  timers: EntityState<Timer>;
  loaded: boolean;
}

export const TIMERS_KEY = 'timers';

export const adapter: EntityAdapter<Timer> = createEntityAdapter<Timer>();

const initialState: State = {
  timers: adapter.getInitialState(),
  loaded: false
};

export const timersReducer = createReducer(
  initialState,
  on(timersLoad, state => state),
  on(timersLoadError, state => state),
  on(timersLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    timers: adapter.addMany(action.timers, state.timers)
  })),
  on(timerAdd, state => state),
  on(timerAddError, state => state),
  on(timerAddSuccess, (state, action) => ({
    ...state,
    timers: adapter.addOne(action.timer, state.timers)
  })),
  on(timerDelete, state => state),
  on(timerDeleteError, state => state),
  on(timerDeleteSuccess, (state, action) => ({
    ...state,
    timers: adapter.removeOne(action.id, state.timers)
  })),
  on(timerUpdate, state => state),
  on(timerUpdateError, state => state),
  on(timerUpdateSuccess, (state, action) => ({
    ...state,
    timers: adapter.updateOne(action.timer, state.timers)
  })),
  on(timersReset, () => initialState)
);
