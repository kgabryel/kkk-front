import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { Season } from '../../models/season';
import { Search } from '../../services/seasons-search.service';
import { adapter, SEASONS_KEY, State } from './reducers';

const selectState = createFeatureSelector<State>(SEASONS_KEY);

const seasonsState = createSelector(selectState, (selectState: State) => selectState.seasons);

const { selectAll } = adapter.getSelectors(seasonsState);

export const selectSeasons = selectAll;

export const selectIsLoaded = createSelector(
  selectState,
  (selectState: State) => selectState.loaded,
);

export const searchSeasons = (search: Search): MemoizedSelector<object, Season[]> =>
  createSelector(selectSeasons, (seasons: Season[]) =>
    seasons.filter((season: Season) => {
      let result = true;

      if (search.ingredients.length !== 0) {
        if (!search.ingredients.includes(season.ingredientId)) {
          result = false;
        }
      }
      if (search.months.length !== 0 && result) {
        let inRange = false;
        search.months.forEach((month: number) => {
          if (season.start <= month && season.stop >= month) {
            inRange = true;
          }
          if (!inRange) {
            result = false;
          }
        });
      }

      return result;
    }),
  );
