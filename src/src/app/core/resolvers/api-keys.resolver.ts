import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {keysLoad} from '../store/api-keys/actions';
import {selectIsLoaded} from '../store/api-keys/selectors';
import {State} from '../store/api-keys/reducers';

@Injectable()
export class ApiKeysResolver implements Resolve<boolean> {
  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(keysLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
