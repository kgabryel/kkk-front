import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';

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
  userType: ''
};

export const settingsReducer = createReducer(
  initialState,
  on(actions.settingsLoad, state => state),
  on(actions.settingsLoadError, state => state),
  on(actions.settingsLoadSuccess, (state, action) => {
    return {
      loaded: true,
      autocomplete: action.settings.autocomplete,
      ozaKey: action.settings.ozaKey,
      userType: action.settings.userType
    };
  }),
  on(actions.switchAutocomplete, state => state),
  on(actions.changeOzaKey, state => state),
  on(actions.updateError, state => state),
  on(actions.updateSuccess, (state, action) => {
    return {
      loaded: true,
      autocomplete: action.settings.autocomplete,
      ozaKey: action.settings.ozaKey,
      userType: action.settings.userType
    };
  }),
  on(actions.settingsReset, () => initialState)
);
