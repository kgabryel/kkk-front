import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Recipe } from '../../models/recipe';
import {
  photoAdd,
  photoAddError,
  photoAddSuccess,
  photosReorder,
  recipeAdd,
  recipeAddError,
  recipeAddSuccess,
  recipeDelete,
  recipeDeleteError,
  recipeDeleteSuccess,
  recipeFavouriteUpdate,
  recipesLoad,
  recipesLoadError,
  recipesLoadSuccess,
  recipesReset,
  recipeToDoUpdate,
  recipeUpdate,
  recipeUpdateError,
  recipeUpdateSuccess,
} from './actions';

export interface State {
  recipes: EntityState<Recipe>;
  loaded: boolean;
}

export const RECIPES_KEY = 'recipes';

export const adapter: EntityAdapter<Recipe> = createEntityAdapter<Recipe>();

const initialState: State = {
  loaded: false,
  recipes: adapter.getInitialState(),
};

export const recipesReducer = createReducer(
  initialState,
  on(recipesLoad, (state: State) => state),
  on(recipesLoadError, (state: State) => state),
  on(recipesLoadSuccess, (state: State, action: ReturnType<typeof recipesLoadSuccess>) => ({
    ...state,
    loaded: true,
    recipes: adapter.addMany(action.recipes, state.recipes),
  })),
  on(recipeAdd, (state: State) => state),
  on(recipeAddError, (state: State) => state),
  on(recipeAddSuccess, (state: State, action: ReturnType<typeof recipeAddSuccess>) => ({
    ...state,
    recipes: adapter.addOne(action.recipe, state.recipes),
  })),
  on(recipeDelete, (state: State) => state),
  on(recipeDeleteError, (state: State) => state),
  on(recipeDeleteSuccess, (state: State, action: ReturnType<typeof recipeDeleteSuccess>) => ({
    ...state,
    recipes: adapter.removeOne(action.id, state.recipes),
  })),
  on(recipeUpdate, (state: State) => state),
  on(recipeFavouriteUpdate, (state: State) => state),
  on(recipeToDoUpdate, (state: State) => state),
  on(recipeUpdateError, (state: State) => state),
  on(recipeUpdateSuccess, (state: State, action: ReturnType<typeof recipeUpdateSuccess>) => ({
    ...state,
    recipes: adapter.updateOne(action.recipe, state.recipes),
  })),
  on(recipesReset, () => initialState),
  on(photoAdd, (state: State) => state),
  on(photoAddError, (state: State) => state),
  on(photoAddSuccess, (state: State, action: ReturnType<typeof photoAddSuccess>) => ({
    ...state,
    recipes: adapter.updateOne(action.recipe, state.recipes),
  })),
  on(photosReorder, (state: State) => state),
);
