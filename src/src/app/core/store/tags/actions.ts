import {createAction, props} from '@ngrx/store';
import {Tag} from '../../models/tag';
import {Update} from '@ngrx/entity';
import {Actions, Prefixes} from '../actions.config';

export const tagsLoad = createAction(`${Prefixes.tags} ${Actions.load}`);

export const tagsLoadError = createAction(`${Prefixes.tags} ${Actions.loadError}`);

export const tagsLoadSuccess = createAction(
  `${Prefixes.tags} ${Actions.loadSuccess}`,
  props<{ tags: Tag[] }>()
);

export const tagAdd = createAction(
  `${Prefixes.tags} ${Actions.add}`,
  props<{ name: string }>()
);

export const tagAddFromRecipe = createAction(
  `${Prefixes.tags} ${Actions.addFromRecipe}`,
  props<{ name: string }>()
);

export const tagAddError = createAction(`${Prefixes.tags} ${Actions.addError}`);

export const tagAddSuccess = createAction(
  `${Prefixes.tags} ${Actions.addSuccess}`,
  props<{ tag: Tag }>()
);

export const tagDelete = createAction(
  `${Prefixes.tags} ${Actions.delete}`,
  props<{ id: number }>()
);

export const tagDeleteError = createAction(`${Prefixes.tags} ${Actions.deleteError}`);

export const tagDeleteSuccess = createAction(
  `${Prefixes.tags} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const tagUpdate = createAction(
  `${Prefixes.tags} ${Actions.update}`,
  props<{ id: number, name: string }>()
);

export const tagUpdateError = createAction(`${Prefixes.tags} ${Actions.updateError}`);

export const tagUpdateSuccess = createAction(
  `${Prefixes.tags} ${Actions.updateSuccess}`,
  props<{ tag: Update<Tag> }>()
);

export const tagsReset = createAction(`${Prefixes.tags} ${Actions.reset}`);
