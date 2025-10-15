import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { recipesLoad } from '../store/recipes/actions';
import { selectIsLoaded } from '../store/recipes/selectors';

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
