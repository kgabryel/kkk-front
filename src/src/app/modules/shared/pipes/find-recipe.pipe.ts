import { Pipe, PipeTransform, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../core/models/recipe';
import { State } from '../../../core/store/recipes/reducers';
import { selectById } from '../../../core/store/recipes/selectors';

@Pipe({
  name: 'findRecipe',
  standalone: true,
})
export class FindRecipePipe implements PipeTransform {
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

  public transform(value: number): Signal<Recipe | undefined> {
    return this.store.selectSignal(selectById(value));
  }
}
