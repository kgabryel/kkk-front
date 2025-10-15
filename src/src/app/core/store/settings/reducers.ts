import { createReducer, on } from '@ngrx/store';

import {
  changeOzaKey,
  settingsLoad,
  settingsLoadError,
  settingsLoadSuccess,
  settingsReset,
  switchAutocomplete,
  updateError,
  updateSuccess,
} from './actions';

export interface State {
  autocomplete: boolean;
  loaded: boolean;
  ozaKey: string | null;
  userType: string;
}

export const SETTINGS_KEY = 'settings';

const initialState: State = {
  autocomplete: false,
  loaded: false,
  ozaKey: null,
  userType: '',
};

export const settingsReducer = createReducer(
  initialState,
  on(settingsLoad, (state: State) => state),
  on(settingsLoadError, (state: State) => state),
  on(settingsLoadSuccess, (state: State, action: ReturnType<typeof settingsLoadSuccess>) => {
    return {
      autocomplete: action.settings.autocomplete,
      loaded: true,
      ozaKey: action.settings.ozaKey,
      userType: action.settings.userType,
    };
  }),
  on(switchAutocomplete, (state: State) => state),
  on(changeOzaKey, (state: State) => state),
  on(updateError, (state: State) => state),
  on(updateSuccess, (state: State, action: ReturnType<typeof updateSuccess>) => {
    return {
      autocomplete: action.settings.autocomplete,
      loaded: true,
      ozaKey: action.settings.ozaKey,
      userType: action.settings.userType,
    };
  }),
  on(settingsReset, () => initialState),
);
