import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { Timer } from '../../models/timer';
import { TimerRequest } from '../../requests/timer.request';
import { Actions, Prefixes } from '../actions.config';

export const timersLoad = createAction(`${Prefixes.timers} ${Actions.load}`);

export const timersLoadError = createAction(`${Prefixes.timers} ${Actions.loadError}`);

export const timersLoadSuccess = createAction(
  `${Prefixes.timers} ${Actions.loadSuccess}`,
  props<{ timers: Timer[] }>(),
);

export const timerAdd = createAction(
  `${Prefixes.timers} ${Actions.add}`,
  props<{ timer: TimerRequest }>(),
);

export const timerAddError = createAction(`${Prefixes.timers} ${Actions.addError}`);

export const timerAddSuccess = createAction(
  `${Prefixes.timers} ${Actions.addSuccess}`,
  props<{ timer: Timer }>(),
);

export const timerDelete = createAction(
  `${Prefixes.timers} ${Actions.delete}`,
  props<{ id: number }>(),
);

export const timerDeleteError = createAction(`${Prefixes.timers} ${Actions.deleteError}`);

export const timerDeleteSuccess = createAction(
  `${Prefixes.timers} ${Actions.deleteSuccess}`,
  props<{ id: number }>(),
);

export const timerUpdate = createAction(
  `${Prefixes.timers} ${Actions.update}`,
  props<{ id: number; timer: TimerRequest }>(),
);

export const timerUpdateError = createAction(`${Prefixes.timers} ${Actions.updateError}`);

export const timerUpdateSuccess = createAction(
  `${Prefixes.timers} ${Actions.updateSuccess}`,
  props<{ timer: Update<Timer> }>(),
);

export const timersReset = createAction(`${Prefixes.timers} ${Actions.reset}`);
