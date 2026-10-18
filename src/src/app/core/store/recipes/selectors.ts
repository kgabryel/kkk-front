import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { Ingredient } from '../../models/ingredient';
import { Recipe, RecipePosition, RecipePositionsGroup } from '../../models/recipe';
import { Tag } from '../../models/tag';
import {
  RecipeIngredient,
  RecipeIngredientsService,
} from '../../services/recipe-ingredients.service';
import { Search } from '../../services/recipes-search.service';
import { StringUtils } from '../../utils/string.utils';
import { selectIngredients } from '../ingredients/selectors';
import { adapter, RECIPES_KEY, State } from './reducers';

const selectState = createFeatureSelector<State>(RECIPES_KEY);

const recipesState = createSelector(selectState, (selectState: State) => selectState.recipes);

const { selectAll } = adapter.getSelectors(recipesState);

export const selectRecipes = selectAll;

export const selectIsLoaded = createSelector(
  selectState,
  (selectState: State) => selectState.loaded,
);

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
  createSelector(selectRecipes, (recipes: Recipe[]) =>
    recipes.find((recipe: Recipe) => recipe.id === id),
  );

export const selectRecipesForIngredient = (
  ingredient: Ingredient,
): MemoizedSelector<object, Recipe[]> =>
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

export const searchRecipes = (search: Search): MemoizedSelector<object, Recipe[]> =>
  createSelector(selectRecipes, selectIngredients, (recipes: Recipe[], ingredients: Ingredient[]) =>
    recipes.filter((recipe: Recipe) => {
      if (!StringUtils.stringIncludes(recipe.name, search.name)) {
        return false;
      }
      if (search.favourite !== null) {
        if (search.favourite !== recipe.favourite) {
          return false;
        }
      }
      if (search.toDo !== null) {
        if (search.toDo !== recipe.toDo) {
          return false;
        }
      }
      if (search.hasLink !== null) {
        if (search.hasLink && (recipe.url === null || recipe.url === '')) {
          return false;
        }
        if (!search.hasLink && !(recipe.url === null || recipe.url === '')) {
          return false;
        }
      }

      if (search.tags.length > 0) {
        if (!search.tags.some((tag: number) => recipe.tags.includes(tag))) {
          return false;
        }
      }

      if (search.ingredients.length > 0) {
        const service = new RecipeIngredientsService(recipe, ingredients, recipes);
        service.process();
        if (
          !service
            .getIngredients()
            .map((ingredient: RecipeIngredient) => ingredient.id)
            .some((ingredient: number) => search.ingredients.includes(ingredient))
        ) {
          return false;
        }
      }

      if (search.available !== null) {
        const service = new RecipeIngredientsService(recipe, ingredients, recipes);
        service.process();
        if (search.available) {
          return (
            service
              .getIngredients()
              .filter(
                (ingredient: RecipeIngredient) => !ingredient.additional && !ingredient.available,
              ).length === 0
          );
        } else {
          return (
            service.getIngredients().filter((ingredient: RecipeIngredient) => ingredient.available)
              .length === 0
          );
        }
      }

      return true;
    }),
  );

export const selectRecipeAvailable = (
  recipe: Recipe | undefined,
): MemoizedSelector<object, boolean> =>
  createSelector(
    selectRecipes,
    selectIngredients,
    (recipes: Recipe[], ingredients: Ingredient[]) => {
      if (recipe !== undefined) {
        const service = new RecipeIngredientsService(recipe, ingredients, recipes);
        service.process();

        return (
          service
            .getIngredients()
            .filter(
              (ingredient: RecipeIngredient) => !ingredient.additional && !ingredient.available,
            ).length === 0
        );
      }

      return false;
    },
  );
