import type { MemoizedSelector } from '@ngrx/store';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { Season } from '@/app/core/models/season';
import type { Search } from '@/app/core/services/ingredients-search.service';

import { selectSeasons } from '@/app/core/store/seasons/selectors';
import { StringUtils } from '@/app/core/utils/string.utils';

import type { State } from './reducers';

import { adapter, INGREDIENTS_KEY } from './reducers';

const selectState = createFeatureSelector<State>(INGREDIENTS_KEY);

const ingredientsState = createSelector(selectState, (selectState: State) => selectState.ingredients);

const { selectAll } = adapter.getSelectors(ingredientsState);

export const selectIngredients = createSelector(selectAll, (ingredients: Ingredient[]) =>
  [...ingredients].sort((a: Ingredient, b: Ingredient) => StringUtils.compareString(a.name, b.name)),
);

export const selectIsLoaded = createSelector(selectState, (selectState: State) => selectState.loaded);

export const selectByName = (name: string): MemoizedSelector<object, Ingredient | undefined> =>
  createSelector(selectIngredients, (ingredients: Ingredient[]) =>
    ingredients.find((ingredient: Ingredient) => ingredient.name.toLowerCase() === name.toLowerCase()),
  );

export const selectById = (id: number): MemoizedSelector<object, Ingredient | undefined> =>
  createSelector(selectIngredients, (ingredients: Ingredient[]) =>
    ingredients.find((ingredient: Ingredient) => ingredient.id === id),
  );

export const searchIngredients = (search: Search): MemoizedSelector<object, Ingredient[]> =>
  createSelector(selectIngredients, (ingredients: Ingredient[]) =>
    ingredients.filter((ingredient: Ingredient) => {
      if (!StringUtils.stringIncludes(ingredient.name, search.name)) {
        return false;
      }
      if (search.available !== null) {
        if (search.available) {
          return ingredient.available;
        }
      }

      return true;
    }),
  );

export const selectIngredientsWithSeason = createSelector(
  selectIngredients,
  selectSeasons,
  (ingredients: Ingredient[], seasons: Season[]) => {
    const usedIds = seasons.map((s: Season) => s.ingredientId);

    return ingredients.filter((i: Ingredient) => usedIds.includes(i.id));
  },
);

export const selectIngredientsWithoutSeason = createSelector(
  selectIngredients,
  selectSeasons,
  (ingredients: Ingredient[], seasons: Season[]) => {
    const usedIds = seasons.map((s: Season) => s.ingredientId);

    return ingredients.filter((i: Ingredient) => !usedIds.includes(i.id));
  },
);
