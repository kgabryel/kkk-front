import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Ingredient} from '../../models/ingredient';
import {createReducer, on} from '@ngrx/store';
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
  ingredientUpdateSuccess
} from './actions';
import {changeOzaKey} from '../settings/actions';

export interface State {
  ingredients: EntityState<Ingredient>;
  loaded: boolean;
}

export const INGREDIENTS_KEY = 'ingredients';

export const adapter: EntityAdapter<Ingredient> = createEntityAdapter<Ingredient>();

const initialState: State = {
  ingredients: adapter.getInitialState(),
  loaded: false
};

export const ingredientsReducer = createReducer(
  initialState,
  on(ingredientsLoad, state => state),
  on(ingredientsLoadError, state => state),
  on(ingredientsLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    ingredients: adapter.addMany(action.ingredients, state.ingredients)
  })),
  on(ingredientAdd, state => state),
  on(ingredientAddError, state => state),
  on(ingredientAddSuccess, (state, action) => ({
    ...state,
    ingredients: adapter.addOne(action.ingredient, state.ingredients)
  })),
  on(ingredientDelete, state => state),
  on(ingredientDeleteError, state => state),
  on(ingredientDeleteSuccess, (state, action) => ({
    ...state,
    ingredients: adapter.removeOne(action.id, state.ingredients)
  })),
  on(ingredientNameUpdate, state => state),
  on(ingredientOzaIdUpdate, state => state),
  on(ingredientAvailableUpdate, state => state),
  on(ingredientUpdateError, state => state),
  on(ingredientUpdateSuccess, (state, action) => ({
    ...state,
    ingredients: adapter.updateOne(action.ingredient, state.ingredients)
  })),
  on(ingredientsReset, () => initialState),
  on(changeOzaKey, () => initialState)
);
