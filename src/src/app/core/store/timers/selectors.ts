import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adapter, State, TIMERS_KEY } from './reducers';

const selectState = createFeatureSelector<State>(TIMERS_KEY);

const timersState = createSelector(selectState, (selectState: State) => selectState.timers);

const { selectAll } = adapter.getSelectors(timersState);

export const selectTimers = selectAll;

export const selectIsLoaded = createSelector(
  selectState,
  (selectState: State) => selectState.loaded,
);
