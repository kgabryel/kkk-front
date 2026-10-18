import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, take, tap} from 'rxjs/operators';
import {State} from '../store/seasons/reducers';
import {seasonsLoad} from '../store/seasons/actions';
import {selectIsLoaded} from '../store/seasons/selectors';

@Injectable()
export class SeasonsResolver implements Resolve<boolean> {

  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(seasonsLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
