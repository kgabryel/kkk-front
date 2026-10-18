import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, RECIPES_KEY, State} from './reducers';
import {Recipe} from '../../models/recipe';
import {Tag} from '../../models/tag';
import {Ingredient} from '../../models/ingredient';
import {Search} from '../../services/recipes-search/recipes-search.service';
import {selectIngredients} from '../ingredients/selectors';
import {StringUtils} from '../../utils/string.utils';
import {RecipeIngredientsService} from '../../services/recipe-ingredients/recipe-ingredients.service';

const selectState = createFeatureSelector<State>(RECIPES_KEY);

const recipesState = createSelector(selectState, (selectState: State) => selectState.recipes);

const {selectAll} = adapter.getSelectors(recipesState);

export const selectRecipes = selectAll;

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);

export const selectFavouriteRecipes = createSelector(
  selectRecipes,
  recipes => (recipes.filter(recipe => recipe.favourite))
);

export const selectToDoRecipes = createSelector(
  selectRecipes,
  recipes => (recipes.filter(recipe => recipe.toDo))
);

export const selectRecipesForTag = (tag: Tag) => createSelector(
  selectRecipes,
  recipes => (recipes.filter(recipe => recipe.tags.includes(tag.id)))
);

export const selectById = (id: number) => createSelector(
  selectRecipes,
  recipes => recipes.find(recipe => recipe.id === id)
);


export const selectRecipesForIngredient = (ingredient: Ingredient) => createSelector(
  selectRecipes,
  recipes => (recipes.filter(recipe => {
      let result = false;
      recipe.groups.forEach(group => group.positions.forEach(position => {
        if (position.ingredient === ingredient.id) {
          result = true;
        }
      }));
      return result;
    })
  )
);

export const searchRecipes = (search: Search) => createSelector(
  selectRecipes,
  selectIngredients,
  (recipes: Recipe[], ingredients: Ingredient[]) => recipes.filter(recipe => {
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
      if (!search.tags.some(tag => recipe.tags.includes(tag))) {
        return false;
      }
    }

    if (search.ingredients.length > 0) {
      const service = new RecipeIngredientsService(recipe, ingredients, recipes);
      service.process();
      if (!service.getIngredients().map(ingredient => ingredient.id).some(ingredient => search.ingredients.includes(ingredient))) {
        return false;
      }
    }

    if (search.available !== null) {
      const service = new RecipeIngredientsService(recipe, ingredients, recipes);
      service.process();
      if (search.available) {
        return service.getIngredients().filter(ingredient => !ingredient.additional && !ingredient.available).length === 0;
      } else {
        return service.getIngredients().filter(ingredient => ingredient.available).length === 0;
      }
    }
    return true;
  })
);


export const selectRecipeAvailable = (recipe: Recipe | undefined) => createSelector(
  selectRecipes,
  selectIngredients,
  (recipes: Recipe[], ingredients: Ingredient[]) => {
    if (recipe !== undefined) {
      const service = new RecipeIngredientsService(recipe, ingredients, recipes);
      service.process();
      return service.getIngredients().filter(ingredient => !ingredient.additional && !ingredient.available).length === 0;
    }
    return false;
  }
);
