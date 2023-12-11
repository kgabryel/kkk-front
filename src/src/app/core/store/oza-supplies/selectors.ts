import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, State, SUPPLIES_KEY} from './reducers';

const selectState = createFeatureSelector<State>(SUPPLIES_KEY);

const suppliesState = createSelector(selectState, (selectState: State) => selectState.supplies);

const {selectAll} = adapter.getSelectors(suppliesState);

export const selectSupplies = selectAll;

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);

export const selectIsLoadedCorrectly = createSelector(selectState, selectState => selectState.success);

export const selectById = (id: number) => createSelector(
  selectAll,
  supplies => supplies.find(supply => supply.id === id)
);
