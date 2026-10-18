import type { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { ingredientsLoad } from '@/app/core/store/ingredients/actions';
import { selectIsLoaded } from '@/app/core/store/ingredients/selectors';

export const ingredientsResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectIsLoaded).pipe(
    tap((loaded: boolean) => {
      if (!loaded) {
        store.dispatch(ingredientsLoad());
      }
    }),
    filter(Boolean),
    take(1),
  );
};
