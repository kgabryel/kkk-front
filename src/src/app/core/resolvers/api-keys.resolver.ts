import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { keysLoad } from '../store/api-keys/actions';
import { selectIsLoaded } from '../store/api-keys/selectors';

export const apiKeysResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectIsLoaded).pipe(
    tap((loaded: boolean) => {
      if (!loaded) {
        store.dispatch(keysLoad());
      }
    }),
    filter(Boolean),
    take(1),
  );
};
