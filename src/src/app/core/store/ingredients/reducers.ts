import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Ingredient } from '../../models/ingredient';
import { changeOzaKey } from '../settings/actions';
import {
  ingredientAdd,
  ingredientAddError,
  ingredientAddSuccess,
  ingredientAvailableUpdate,
  ingredientDelete,
  ingredientDeleteError,
  ingredientDeleteSuccess,
  ingredientNameUpdate,
  ingredientOzaIdUpdate,
  ingredientsLoad,
  ingredientsLoadError,
  ingredientsLoadSuccess,
  ingredientsReset,
  ingredientUpdateError,
  ingredientUpdateSuccess,
} from './actions';

export interface State {
  ingredients: EntityState<Ingredient>;
  loaded: boolean;
}

export const INGREDIENTS_KEY = 'ingredients';

export const adapter: EntityAdapter<Ingredient> = createEntityAdapter<Ingredient>();

const initialState: State = {
  ingredients: adapter.getInitialState(),
  loaded: false,
};

export const ingredientsReducer = createReducer(
  initialState,
  on(ingredientsLoad, (state: State) => state),
  on(ingredientsLoadError, (state: State) => state),
  on(ingredientsLoadSuccess, (state: State, action: ReturnType<typeof ingredientsLoadSuccess>) => ({
    ...state,
    ingredients: adapter.addMany(action.ingredients, state.ingredients),
    loaded: true,
  })),
  on(ingredientAdd, (state: State) => state),
  on(ingredientAddError, (state: State) => state),
  on(ingredientAddSuccess, (state: State, action: ReturnType<typeof ingredientAddSuccess>) => ({
    ...state,
    ingredients: adapter.addOne(action.ingredient, state.ingredients),
  })),
  on(ingredientDelete, (state: State) => state),
  on(ingredientDeleteError, (state: State) => state),
  on(
    ingredientDeleteSuccess,
    (state: State, action: ReturnType<typeof ingredientDeleteSuccess>) => ({
      ...state,
      ingredients: adapter.removeOne(action.id, state.ingredients),
    }),
  ),
  on(ingredientNameUpdate, (state: State) => state),
  on(ingredientOzaIdUpdate, (state: State) => state),
  on(ingredientAvailableUpdate, (state: State) => state),
  on(ingredientUpdateError, (state: State) => state),
  on(
    ingredientUpdateSuccess,
    (state: State, action: ReturnType<typeof ingredientUpdateSuccess>) => ({
      ...state,
      ingredients: adapter.updateOne(action.ingredient, state.ingredients),
    }),
  ),
  on(ingredientsReset, () => initialState),
  on(changeOzaKey, () => initialState),
);
