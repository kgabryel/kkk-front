import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Store} from '@ngrx/store';
import {State} from '../store/timers/reducers';
import {Observable} from 'rxjs';
import {timersLoad} from '../store/timers/actions';
import {selectIsLoaded} from '../store/timers/selectors';
import {filter, take, tap} from 'rxjs/operators';

@Injectable()
export class TimersResolver implements Resolve<boolean> {

  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(timersLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
