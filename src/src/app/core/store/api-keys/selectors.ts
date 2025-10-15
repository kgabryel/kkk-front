import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adapter, API_KEYS_KEY, State } from './reducers';

const selectState = createFeatureSelector<State>(API_KEYS_KEY);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState: State) => selectState.loaded,
);

const keyState = createSelector(selectState, (selectState: State) => selectState.apiKeys);

const { selectAll } = adapter.getSelectors(keyState);

export const selectKeys = selectAll;
