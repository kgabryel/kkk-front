import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, SEASONS_KEY, State} from './reducers';
import {Search} from '../../services/seasons-search/seasons-search.service';

const selectState = createFeatureSelector<State>(SEASONS_KEY);

const seasonsState = createSelector(selectState, (selectState: State) => selectState.seasons);

const {selectAll} = adapter.getSelectors(seasonsState);

export const selectSeasons = selectAll;

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);

export const searchSeasons = (search: Search) => createSelector(
  selectSeasons,
  seasons => seasons.filter(season => {
    let result = true;
    if (search.ingredients.length !== 0) {
      if (!search.ingredients.includes(season.ingredientId)) {
        result = false;
      }
    }
    if (search.months.length !== 0 && result) {
      let inRange = false;
      search.months.forEach(month => {
        if (season.start <= month && season.stop >= month) {
          inRange = true;
        }
        if (!inRange) {
          result = false;
        }
      });
    }
    return result;
  })
);
