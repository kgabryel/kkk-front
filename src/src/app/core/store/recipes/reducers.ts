import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
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
  recipeUpdateSuccess
} from './actions';
import {Recipe} from '../../models/recipe';

export interface State {
  recipes: EntityState<Recipe>;
  loaded: boolean;
}

export const RECIPES_KEY = 'recipes';

export const adapter: EntityAdapter<Recipe> = createEntityAdapter<Recipe>();

const initialState: State = {
  recipes: adapter.getInitialState(),
  loaded: false
};

export const recipesReducer = createReducer(
  initialState,
  on(recipesLoad, state => state),
  on(recipesLoadError, state => state),
  on(recipesLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    recipes: adapter.addMany(action.recipes, state.recipes)
  })),
  on(recipeAdd, state => state),
  on(recipeAddError, state => state),
  on(recipeAddSuccess, (state, action) => ({
    ...state,
    recipes: adapter.addOne(action.recipe, state.recipes)
  })),
  on(recipeDelete, state => state),
  on(recipeDeleteError, state => state),
  on(recipeDeleteSuccess, (state, action) => ({
    ...state,
    recipes: adapter.removeOne(action.id, state.recipes)
  })),
  on(recipeUpdate, state => state),
  on(recipeFavouriteUpdate, state => state),
  on(recipeToDoUpdate, state => state),
  on(recipeUpdateError, state => state),
  on(recipeUpdateSuccess, (state, action) => ({
    ...state,
    recipes: adapter.updateOne(action.recipe, state.recipes)
  })),
  on(recipesReset, () => initialState),
  on(photoAdd, state => state),
  on(photoAddError, state => state),
  on(photoAddSuccess, (state, action) => ({
    ...state,
    recipes: adapter.updateOne(action.recipe, state.recipes)
  })),
  on(photosReorder, state => state)
);
