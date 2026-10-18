import type { PipeTransform, Signal } from '@angular/core';

import { Pipe, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { State } from '@/app/core/store/recipes/reducers';

import { selectById } from '@/app/core/store/recipes/selectors';

@Pipe({
  name: 'findRecipe',
})
export class FindRecipePipe implements PipeTransform {
  private store: Store<State> = inject<Store<State>>(Store);

  public transform(value: number): Signal<Recipe | undefined> {
    return this.store.selectSignal(selectById(value));
  }
}
