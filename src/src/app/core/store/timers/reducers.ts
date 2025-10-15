import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Timer } from '../../models/timer';
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
  timerUpdateSuccess,
} from './actions';

export interface State {
  timers: EntityState<Timer>;
  loaded: boolean;
}

export const TIMERS_KEY = 'timers';

export const adapter: EntityAdapter<Timer> = createEntityAdapter<Timer>();

const initialState: State = {
  loaded: false,
  timers: adapter.getInitialState(),
};

export const timersReducer = createReducer(
  initialState,
  on(timersLoad, (state: State) => state),
  on(timersLoadError, (state: State) => state),
  on(timersLoadSuccess, (state: State, action: ReturnType<typeof timersLoadSuccess>) => ({
    ...state,
    loaded: true,
    timers: adapter.addMany(action.timers, state.timers),
  })),
  on(timerAdd, (state: State) => state),
  on(timerAddError, (state: State) => state),
  on(timerAddSuccess, (state: State, action: ReturnType<typeof timerAddSuccess>) => ({
    ...state,
    timers: adapter.addOne(action.timer, state.timers),
  })),
  on(timerDelete, (state: State) => state),
  on(timerDeleteError, (state: State) => state),
  on(timerDeleteSuccess, (state: State, action: ReturnType<typeof timerDeleteSuccess>) => ({
    ...state,
    timers: adapter.removeOne(action.id, state.timers),
  })),
  on(timerUpdate, (state: State) => state),
  on(timerUpdateError, (state: State) => state),
  on(timerUpdateSuccess, (state: State, action: ReturnType<typeof timerUpdateSuccess>) => ({
    ...state,
    timers: adapter.updateOne(action.timer, state.timers),
  })),
  on(timersReset, () => initialState),
);
