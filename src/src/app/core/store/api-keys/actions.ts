import {createAction, props} from '@ngrx/store';
import {Actions, Prefixes} from '../actions.config';
import {ApiKey} from '../../models/api-key';
import {Update} from '@ngrx/entity';

export const keysLoad = createAction(`${Prefixes.apiKeys} ${Actions.load}`);

export const keysLoadError = createAction(`${Prefixes.apiKeys} ${Actions.loadError}`);

export const keysLoadSuccess = createAction(
  `${Prefixes.apiKeys} ${Actions.loadSuccess}`,
  props<{ apiKeys: ApiKey[] }>()
);

export const keyAdd = createAction(`${Prefixes.apiKeys} ${Actions.add}`);

export const keyAddError = createAction(`${Prefixes.apiKeys} ${Actions.addError}`);

export const keyAddSuccess = createAction(
  `${Prefixes.apiKeys} ${Actions.addSuccess}`,
  props<{ apiKey: ApiKey }>()
);

export const keyDelete = createAction(
  `${Prefixes.apiKeys} ${Actions.delete}`,
  props<{ id: number }>()
);

export const keyDeleteError = createAction(`${Prefixes.apiKeys} ${Actions.deleteError}`);

export const keyDeleteSuccess = createAction(
  `${Prefixes.apiKeys} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const keyUpdate = createAction(
  `${Prefixes.apiKeys} ${Actions.update}`,
  props<{ id: number }>()
);

export const keyUpdateSuccess = createAction(
  `${Prefixes.apiKeys} ${Actions.updateSuccess}`,
  props<{ apiKey: Update<ApiKey> }>()
);

export const keyUpdateError = createAction(`${Prefixes.apiKeys} ${Actions.updateError}`);

export const keysReset = createAction(`${Prefixes.apiKeys} ${Actions.reset}`);
