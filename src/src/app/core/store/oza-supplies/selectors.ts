import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { OzaSupply } from '../../models/oza-supply';
import { adapter, State, SUPPLIES_KEY } from './reducers';

const selectState = createFeatureSelector<State>(SUPPLIES_KEY);

const suppliesState = createSelector(selectState, (selectState: State) => selectState.supplies);

const { selectAll } = adapter.getSelectors(suppliesState);

export const selectSupplies = selectAll;

export const selectIsLoaded = createSelector(
  selectState,
  (selectState: State) => selectState.loaded,
);

export const selectIsLoadedCorrectly = createSelector(
  selectState,
  (selectState: State) => selectState.success,
);

export const selectById = (id: number): MemoizedSelector<object, OzaSupply | undefined> =>
  createSelector(selectAll, (supplies: OzaSupply[]) =>
    supplies.find((supply: OzaSupply) => supply.id === id),
  );
