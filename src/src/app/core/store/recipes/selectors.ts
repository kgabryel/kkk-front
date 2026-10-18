import type { MemoizedSelector } from '@ngrx/store';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { Recipe, RecipePosition, RecipePositionsGroup } from '@/app/core/models/recipe';
import type { Tag } from '@/app/core/models/tag';
import type { RecipeIngredient } from '@/app/core/services/recipe-ingredients.service';
import type { Search } from '@/app/core/services/recipes-search.service';

import { RecipeIngredientsService } from '@/app/core/services/recipe-ingredients.service';
import { selectIngredients } from '@/app/core/store/ingredients/selectors';
import { StringUtils } from '@/app/core/utils/string.utils';

import type { State } from './reducers';

import { adapter, RECIPES_KEY } from './reducers';

const selectState = createFeatureSelector<State>(RECIPES_KEY);

const recipesState = createSelector(selectState, (selectState: State) => selectState.recipes);

const { selectAll } = adapter.getSelectors(recipesState);

export const selectRecipes = selectAll;

export const selectIsLoaded = createSelector(selectState, (selectState: State) => selectState.loaded);

export const selectFavouriteRecipes = createSelector(selectRecipes, (recipes: Recipe[]) =>
  recipes.filter((recipe: Recipe) => recipe.favourite),
);

export const selectToDoRecipes = createSelector(selectRecipes, (recipes: Recipe[]) =>
  recipes.filter((recipe: Recipe) => recipe.toDo),
);

export const selectRecipesForTag = (tag: Tag): MemoizedSelector<object, Recipe[]> =>
  createSelector(selectRecipes, (recipes: Recipe[]) =>
    recipes.filter((recipe: Recipe) => recipe.tags.includes(tag.id)),
  );

export const selectById = (id: number): MemoizedSelector<object, Recipe | undefined> =>
  createSelector(selectRecipes, (recipes: Recipe[]) => recipes.find((recipe: Recipe) => recipe.id === id));

export const selectRecipesForIngredient = (ingredient: Ingredient): MemoizedSelector<object, Recipe[]> =>
  createSelector(selectRecipes, (recipes: Recipe[]) =>
    recipes.filter((recipe: Recipe) => {
      let result = false;
      recipe.groups.forEach((group: RecipePositionsGroup) =>
        group.positions.forEach((position: RecipePosition) => {
          if (position.ingredient === ingredient.id) {
            result = true;
          }
        }),
      );

      return result;
    }),
  );

export const searchRecipes = (search: Search): MemoizedSelector<object, Recipe[]> => {
  const matchesFlag = (expected: boolean | null, actual: boolean): boolean => expected === null || expected === actual;

  const hasUrl = (recipe: Recipe): boolean => recipe.url !== null && recipe.url !== '';

  const matchesLink = (recipe: Recipe): boolean => search.hasLink === null || search.hasLink === hasUrl(recipe);

  const matchesTags = (recipe: Recipe): boolean =>
    search.tags.length === 0 || search.tags.some((tag: number) => recipe.tags.includes(tag));

  const matchesIngredients = (list: RecipeIngredient[]): boolean =>
    search.ingredients.length === 0 ||
    list.some((ingredient: RecipeIngredient) => search.ingredients.includes(ingredient.id));

  const matchesAvailability = (list: RecipeIngredient[]): boolean => {
    if (search.available === null) {
      return true;
    }
    if (search.available) {
      return list.every((ingredient: RecipeIngredient) => ingredient.additional || ingredient.available);
    }

    return list.every((ingredient: RecipeIngredient) => !ingredient.available);
  };

  const matchesRecipeIngredients = (recipe: Recipe, recipes: Recipe[], ingredients: Ingredient[]): boolean => {
    if (search.ingredients.length === 0 && search.available === null) {
      return true;
    }
    const service = new RecipeIngredientsService(recipe, ingredients, recipes);
    service.process();
    const list = service.getIngredients();

    return matchesIngredients(list) && matchesAvailability(list);
  };

  return createSelector(selectRecipes, selectIngredients, (recipes: Recipe[], ingredients: Ingredient[]) =>
    recipes.filter(
      (recipe: Recipe) =>
        StringUtils.stringIncludes(recipe.name, search.name) &&
        matchesFlag(search.favourite, recipe.favourite) &&
        matchesFlag(search.toDo, recipe.toDo) &&
        matchesLink(recipe) &&
        matchesTags(recipe) &&
        matchesRecipeIngredients(recipe, recipes, ingredients),
    ),
  );
};

export const selectRecipeAvailable = (recipe: Recipe | undefined): MemoizedSelector<object, boolean> =>
  createSelector(selectRecipes, selectIngredients, (recipes: Recipe[], ingredients: Ingredient[]) => {
    if (recipe !== undefined) {
      const service = new RecipeIngredientsService(recipe, ingredients, recipes);
      service.process();

      return (
        service
          .getIngredients()
          .filter((ingredient: RecipeIngredient) => !ingredient.additional && !ingredient.available).length === 0
      );
    }

    return false;
  });
