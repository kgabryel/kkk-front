import type { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import type { State as SuppliesState } from '@/app/core/store/oza-supplies/reducers';
import type { State as SettingsState } from '@/app/core/store/settings/reducers';

import { keyNotExists, suppliesLoad } from '@/app/core/store/oza-supplies/actions';
import { selectIsLoaded } from '@/app/core/store/oza-supplies/selectors';
import { selectIsLoaded as settingsLoaded, selectOzaKey } from '@/app/core/store/settings/selectors';

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
