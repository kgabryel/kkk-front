import type { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { recipesLoad } from '@/app/core/store/recipes/actions';
import { selectIsLoaded } from '@/app/core/store/recipes/selectors';

export const recipesResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectIsLoaded).pipe(
    tap((loaded: boolean) => {
      if (!loaded) {
        store.dispatch(recipesLoad());
      }
    }),
    filter(Boolean),
    take(1),
  );
};
