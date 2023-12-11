import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Store} from '@ngrx/store';
import {State} from '../store/ingredients/reducers';
import {Observable} from 'rxjs';
import {ingredientsLoad} from '../store/ingredients/actions';
import {selectIsLoaded} from '../store/ingredients/selectors';
import {filter, take, tap} from 'rxjs/operators';

@Injectable()
export class IngredientsResolver implements Resolve<boolean> {

  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(ingredientsLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
