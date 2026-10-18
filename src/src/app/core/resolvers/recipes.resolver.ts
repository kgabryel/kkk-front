import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, take, tap} from 'rxjs/operators';
import {State} from '../store/recipes/reducers';
import {recipesLoad} from '../store/recipes/actions';
import {selectIsLoaded} from '../store/recipes/selectors';

@Injectable()
export class RecipesResolver implements Resolve<boolean> {

  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(recipesLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
