import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { tagsLoad } from '../store/tags/actions';
import { selectIsLoaded } from '../store/tags/selectors';

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
