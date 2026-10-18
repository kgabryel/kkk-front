import type { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { settingsLoad } from '@/app/core/store/settings/actions';
import { selectIsLoaded } from '@/app/core/store/settings/selectors';

export const settingsResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectIsLoaded).pipe(
    tap((loaded: boolean) => {
      if (!loaded) {
        store.dispatch(settingsLoad());
      }
    }),
    filter(Boolean),
    take(1),
  );
};
