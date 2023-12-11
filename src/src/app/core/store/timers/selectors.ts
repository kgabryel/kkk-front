import {adapter, State, TIMERS_KEY} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectState = createFeatureSelector<State>(TIMERS_KEY);

const timersState = createSelector(selectState, selectState => selectState.timers);

const {selectAll} = adapter.getSelectors(timersState);

export const selectTimers = selectAll;

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);
