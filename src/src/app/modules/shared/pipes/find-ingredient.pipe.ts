import type { PipeTransform, Signal } from '@angular/core';

import { Pipe, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { State } from '@/app/core/store/ingredients/reducers';

import { selectById } from '@/app/core/store/ingredients/selectors';

@Pipe({
  name: 'findIngredient',
})
export class FindIngredientPipe implements PipeTransform {
  private store: Store<State> = inject<Store<State>>(Store);

  public transform(value: number): Signal<Ingredient | undefined> {
    return this.store.selectSignal(selectById(value));
  }
}
