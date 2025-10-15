import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { timersLoad } from '../store/timers/actions';
import { selectIsLoaded } from '../store/timers/selectors';

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
