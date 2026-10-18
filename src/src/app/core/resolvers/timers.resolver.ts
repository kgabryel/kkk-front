import type { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { timersLoad } from '@/app/core/store/timers/actions';
import { selectIsLoaded } from '@/app/core/store/timers/selectors';

export const timersResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectIsLoaded).pipe(
    tap((loaded: boolean) => {
      if (!loaded) {
        store.dispatch(timersLoad());
      }
    }),
    filter(Boolean),
    take(1),
  );
};
