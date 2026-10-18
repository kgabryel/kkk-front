import { Pipe, PipeTransform, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../../core/models/ingredient';
import { State } from '../../../core/store/ingredients/reducers';
import { selectById } from '../../../core/store/ingredients/selectors';

@Pipe({
  name: 'findIngredient',
  standalone: true,
})
export class FindIngredientPipe implements PipeTransform {
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

  public transform(value: number): Signal<Ingredient | undefined> {
    return this.store.selectSignal(selectById(value));
  }
}
