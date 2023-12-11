import {adapter, API_KEYS_KEY, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectState = createFeatureSelector<State>(API_KEYS_KEY);

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);

const keyState = createSelector(selectState, selectState => selectState.apiKeys);

const {selectAll} = adapter.getSelectors(keyState);

export const selectKeys = selectAll;
