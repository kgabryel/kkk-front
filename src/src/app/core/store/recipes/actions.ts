import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { Order } from '../../models/photo';
import { Recipe } from '../../models/recipe';
import { RecipeRequest } from '../../requests/recipe.request';
import { Actions, Prefixes } from '../actions.config';

export const recipesLoad = createAction(`${Prefixes.recipes} ${Actions.load}`);

export const recipesLoadError = createAction(`${Prefixes.recipes} ${Actions.loadError}`);

export const recipesLoadSuccess = createAction(
  `${Prefixes.recipes} ${Actions.loadSuccess}`,
  props<{ recipes: Recipe[] }>(),
);

export const recipeAdd = createAction(
  `${Prefixes.recipes} ${Actions.add}`,
  props<{ recipe: RecipeRequest }>(),
);

export const recipeAddError = createAction(`${Prefixes.recipes} ${Actions.addError}`);

export const recipeAddSuccess = createAction(
  `${Prefixes.recipes} ${Actions.addSuccess}`,
  props<{ recipe: Recipe }>(),
);

export const recipeDelete = createAction(
  `${Prefixes.recipes} ${Actions.delete}`,
  props<{ id: number }>(),
);

export const recipeDeleteError = createAction(`${Prefixes.recipes} ${Actions.deleteError}`);

export const recipeDeleteSuccess = createAction(
  `${Prefixes.recipes} ${Actions.deleteSuccess}`,
  props<{ id: number }>(),
);

export const recipeUpdate = createAction(
  `${Prefixes.recipes} ${Actions.update}`,
  props<{ id: number; recipe: RecipeRequest }>(),
);

export const recipeFavouriteUpdate = createAction(
  `${Prefixes.recipes} ${Actions.updateFavourite}`,
  props<{ id: number; favourite: boolean }>(),
);

export const recipeToDoUpdate = createAction(
  `${Prefixes.recipes} ${Actions.updateToDo}`,
  props<{ id: number; toDo: boolean }>(),
);

export const recipeUpdateError = createAction(`${Prefixes.recipes} ${Actions.updateError}`);

export const recipeUpdateSuccess = createAction(
  `${Prefixes.recipes} ${Actions.updateSuccess}`,
  props<{ recipe: Update<Recipe> }>(),
);

export const recipesReset = createAction(`${Prefixes.recipes} ${Actions.reset}`);

export const photoAdd = createAction(
  `${Prefixes.photos} ${Actions.add}`,
  props<{ id: number; photo: string }>(),
);

export const photoAddError = createAction(`${Prefixes.photos} ${Actions.addError}`);

export const photoAddSuccess = createAction(
  `${Prefixes.photos} ${Actions.addSuccess}`,
  props<{ recipe: Update<Recipe> }>(),
);

export const photosReorder = createAction(
  `${Prefixes.photos} ${Actions.reorder}`,
  props<{ id: number; order: Order[] }>(),
);

export const photoDelete = createAction(
  `${Prefixes.photos} ${Actions.delete}`,
  props<{ recipeId: number; photoId: number }>(),
);
