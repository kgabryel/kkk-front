import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { ingredientsLoad } from '../store/ingredients/actions';
import { selectIsLoaded } from '../store/ingredients/selectors';

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
