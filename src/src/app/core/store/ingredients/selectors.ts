import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, INGREDIENTS_KEY, State} from './reducers';
import {Search} from '../../services/ingredients-search/ingredients-search.service';
import {StringUtils} from '../../utils/string.utils';

const selectState = createFeatureSelector<State>(INGREDIENTS_KEY);

const ingredientsState = createSelector(selectState, (selectState: State) => selectState.ingredients);

const {selectAll} = adapter.getSelectors(ingredientsState);

export const selectIngredients = selectAll;

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);

export const selectByName = (name: string) => createSelector(
  selectIngredients,
  ingredients => ingredients.find(ingredient => ingredient.name.toLowerCase() === name.toLowerCase())
);

export const selectById = (id: number) => createSelector(
  selectIngredients,
  ingredients => ingredients.find(ingredient => ingredient.id === id)
);

export const searchIngredients = (search: Search) => createSelector(
  selectIngredients,
  ingredients => ingredients.filter(ingredient => {
    if (!StringUtils.stringIncludes(ingredient.name, search.name)) {
      return false;
    }
    if (search.available !== null) {
      if (search.available) {
        return ingredient.available;
      }
    }
    return true;
  })
);

export const selectIngredientsWithoutAssignedSeason = (usedIngredients: number[]) => createSelector(
  selectIngredients,
  ingredients => ingredients.filter(ingredient => !usedIngredients.includes(ingredient.id))
);

export const selectIngredientsWithAssignedSeason = (usedIngredients: number[]) => createSelector(
  selectIngredients,
  ingredients => ingredients.filter(ingredient => usedIngredients.includes(ingredient.id))
);
