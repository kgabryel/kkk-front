import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SETTINGS_KEY, State } from './reducers';

const selectState = createFeatureSelector<State>(SETTINGS_KEY);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState: State) => selectState.loaded,
);

export const selectAutocomplete = createSelector(
  selectState,
  (selectState: State) => selectState.autocomplete,
);

export const selectOzaKey = createSelector(selectState, (selectState: State) => selectState.ozaKey);

export const selectUserType = createSelector(
  selectState,
  (selectState: State) => selectState.userType,
);
