import {createAction, props} from '@ngrx/store';
import {Actions, Prefixes} from '../actions.config';
import {OzaSupply} from '../../models/oza-supply';

export const suppliesLoad = createAction(`${Prefixes.ozaSupplies} ${Actions.load}`);

export const keyNotExists = createAction(`${Prefixes.ozaSupplies} ${Actions.keyNotExists}`);

export const suppliesLoadError = createAction(`${Prefixes.ozaSupplies} ${Actions.loadError}`);

export const suppliesLoadSuccess = createAction(
  `${Prefixes.ozaSupplies} ${Actions.loadSuccess}`,
  props<{ supplies: OzaSupply[] }>()
);

export const suppliesReset = createAction(`${Prefixes.ozaSupplies} ${Actions.reset}`);
