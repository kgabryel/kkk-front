import type { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { tagsLoad } from '@/app/core/store/tags/actions';
import { selectIsLoaded } from '@/app/core/store/tags/selectors';

export const tagsResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectIsLoaded).pipe(
    tap((loaded: boolean) => {
      if (!loaded) {
        store.dispatch(tagsLoad());
      }
    }),
    filter(Boolean),
    take(1),
  );
};
