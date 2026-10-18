import {createAction, props} from '@ngrx/store';
import {Season} from '../../models/season';
import {Update} from '@ngrx/entity';
import {SeasonRequest, UpdateSeasonRequest} from '../../requests/season.request';
import {Actions, Prefixes} from '../actions.config';

export const seasonsLoad = createAction(`${Prefixes.seasons} ${Actions.load}`);

export const seasonsLoadError = createAction(`${Prefixes.seasons} ${Actions.loadError}`);

export const seasonsLoadSuccess = createAction(
  `${Prefixes.seasons} ${Actions.loadSuccess}`,
  props<{ seasons: Season[] }>()
);

export const seasonAdd = createAction(
  `${Prefixes.seasons} ${Actions.add}`,
  props<{ season: SeasonRequest }>()
);

export const seasonAddError = createAction(`${Prefixes.seasons} ${Actions.addError}`);

export const seasonAddSuccess = createAction(
  `${Prefixes.seasons} ${Actions.addSuccess}`,
  props<{ season: Season }>()
);

export const seasonDelete = createAction(
  `${Prefixes.seasons} ${Actions.delete}`,
  props<{ id: number }>()
);

export const seasonDeleteError = createAction(`${Prefixes.seasons} ${Actions.deleteError}`);

export const seasonDeleteSuccess = createAction(
  `${Prefixes.seasons} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const seasonUpdate = createAction(
  `${Prefixes.seasons} ${Actions.update}`,
  props<{ id: number, season: UpdateSeasonRequest }>()
);

export const seasonUpdateError = createAction(`${Prefixes.seasons} ${Actions.updateError}`);

export const seasonUpdateSuccess = createAction(
  `${Prefixes.seasons} ${Actions.updateSuccess}`,
  props<{ season: Update<Season> }>()
);

export const seasonsReset = createAction(`${Prefixes.seasons} ${Actions.reset}`);
