import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { Ingredient } from '../../models/ingredient';
import { IngredientRequest } from '../../requests/ingredient.request';
import { Actions, Prefixes } from '../actions.config';

export const ingredientsLoad = createAction(`${Prefixes.ingredients} ${Actions.load}`);

export const ingredientsLoadError = createAction(`${Prefixes.ingredients} ${Actions.loadError}`);

export const ingredientsLoadSuccess = createAction(
  `${Prefixes.ingredients} ${Actions.loadSuccess}`,
  props<{ ingredients: Ingredient[] }>(),
);

export const ingredientAdd = createAction(
  `${Prefixes.ingredients} ${Actions.add}`,
  props<{ ingredient: IngredientRequest }>(),
);

export const ingredientAddError = createAction(`${Prefixes.ingredients} ${Actions.addError}`);

export const ingredientAddSuccess = createAction(
  `${Prefixes.ingredients} ${Actions.addSuccess}`,
  props<{ ingredient: Ingredient }>(),
);

export const ingredientDelete = createAction(
  `${Prefixes.ingredients} ${Actions.delete}`,
  props<{ id: number }>(),
);

export const ingredientDeleteError = createAction(`${Prefixes.ingredients} ${Actions.deleteError}`);

export const ingredientDeleteSuccess = createAction(
  `${Prefixes.ingredients} ${Actions.deleteSuccess}`,
  props<{ id: number }>(),
);

export const ingredientNameUpdate = createAction(
  `${Prefixes.ingredients} ${Actions.updateName}`,
  props<{ id: number; name: string }>(),
);

export const ingredientOzaIdUpdate = createAction(
  `${Prefixes.ingredients} ${Actions.updateOzaId}`,
  props<{ id: number; ozaId: number }>(),
);

export const ingredientAvailableUpdate = createAction(
  `${Prefixes.ingredients} ${Actions.updateAvailable}`,
  props<{ id: number; available: boolean }>(),
);

export const ingredientUpdateError = createAction(`${Prefixes.ingredients} ${Actions.updateError}`);

export const ingredientUpdateSuccess = createAction(
  `${Prefixes.ingredients} ${Actions.updateSuccess}`,
  props<{ ingredient: Update<Ingredient> }>(),
);

export const ingredientsReset = createAction(`${Prefixes.ingredients} ${Actions.reset}`);
