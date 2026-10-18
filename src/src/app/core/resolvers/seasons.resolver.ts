import type { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { seasonsLoad } from '@/app/core/store/seasons/actions';
import { selectIsLoaded } from '@/app/core/store/seasons/selectors';

export const seasonsResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectIsLoaded).pipe(
    tap((loaded: boolean) => {
      if (!loaded) {
        store.dispatch(seasonsLoad());
      }
    }),
    filter(Boolean),
    take(1),
  );
};
