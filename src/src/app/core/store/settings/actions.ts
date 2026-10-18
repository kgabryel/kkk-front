import { createAction, props } from '@ngrx/store';

import { Settings } from '../../models/settings';
import { Actions, Prefixes } from '../actions.config';

export const settingsLoad = createAction(`${Prefixes.settings} ${Actions.load}`);

export const settingsLoadError = createAction(`${Prefixes.settings} ${Actions.loadError}`);

export const settingsLoadSuccess = createAction(
  `${Prefixes.settings} ${Actions.loadSuccess}`,
  props<{ settings: Settings }>(),
);

export const switchAutocomplete = createAction(
  `${Prefixes.settings} ${Actions.switchAutocomplete}`,
);

export const changeOzaKey = createAction(
  `${Prefixes.settings} ${Actions.changeOzaKey}`,
  props<{ key: string | null }>(),
);

export const updateSuccess = createAction(
  `${Prefixes.settings} ${Actions.updateSuccess}`,
  props<{ settings: Settings }>(),
);

export const updateError = createAction(`${Prefixes.settings} ${Actions.updateError}`);

export const settingsReset = createAction(`${Prefixes.settings} ${Actions.reset}`);
