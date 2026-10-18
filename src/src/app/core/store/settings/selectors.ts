import {SETTINGS_KEY, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectState = createFeatureSelector<State>(SETTINGS_KEY);

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);

export const selectAutocomplete = createSelector(selectState, selectState => selectState.autocomplete);

export const selectOzaKey = createSelector(selectState, selectState => selectState.ozaKey);

export const selectUserType = createSelector(selectState, selectState => selectState.userType);
