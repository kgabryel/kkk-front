import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Store} from '@ngrx/store';
import {State} from '../store/tags/reducers';
import {Observable} from 'rxjs';
import {tagsLoad} from '../store/tags/actions';
import {selectIsLoaded} from '../store/tags/selectors';
import {filter, take, tap} from 'rxjs/operators';

@Injectable()
export class TagsResolver implements Resolve<boolean> {

  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(tagsLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
