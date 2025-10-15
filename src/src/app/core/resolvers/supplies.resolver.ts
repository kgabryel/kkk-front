import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { keyNotExists, suppliesLoad } from '../store/oza-supplies/actions';
import { State as SuppliesState } from '../store/oza-supplies/reducers';
import { selectIsLoaded } from '../store/oza-supplies/selectors';
import { State as SettingsState } from '../store/settings/reducers';
import { selectIsLoaded as settingsLoaded, selectOzaKey } from '../store/settings/selectors';

export const suppliesResolver: ResolveFn<boolean> = () => {
  const suppliesStore = inject<Store<SuppliesState>>(Store);
  const settingsStore = inject<Store<SettingsState>>(Store);

  const suppliesLoaded$ = suppliesStore.select(selectIsLoaded);
  const settingsKey$ = settingsStore.select(settingsLoaded).pipe(
    filter((loaded: boolean) => loaded),
    switchMap(() => settingsStore.select(selectOzaKey)),
  );

  return combineLatest([suppliesLoaded$, settingsKey$]).pipe(
    tap(([isLoaded, key]: [boolean, string | null]) => {
      if (!isLoaded) {
        if (!key) {
          suppliesStore.dispatch(keyNotExists());
        } else {
          suppliesStore.dispatch(suppliesLoad());
        }
      }
    }),
    filter(([isLoaded]: [boolean, string | null]) => isLoaded),
    take(1),
    map(([isLoaded]: [boolean, string | null]) => isLoaded),
  );
};
