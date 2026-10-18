import {Pipe, PipeTransform} from '@angular/core';
import {State} from '../../../../core/store/ingredients/reducers';
import {Store} from '@ngrx/store';
import {selectById} from '../../../../core/store/ingredients/selectors';
import {Observable} from 'rxjs';
import {Ingredient} from '../../../../core/models/ingredient';

@Pipe({
  name: 'findIngredient'
})
export class FindIngredientPipe implements PipeTransform {

  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  transform(value: number, ...args: unknown[]): Observable<Ingredient | undefined> {
    return this.store.select(selectById(value));
  }
}
