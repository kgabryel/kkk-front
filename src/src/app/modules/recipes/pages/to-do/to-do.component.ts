import type { Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { State } from '@/app/core/store/recipes/reducers';

import { selectToDoRecipes } from '@/app/core/store/recipes/selectors';
import { RecipesListComponent } from '@/app/modules/recipes/components/recipes-list/recipes-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent],
  selector: 'recipes-pages-to-do',
  templateUrl: './to-do.component.html',
})
export class ToDoComponent {
  public recipes: Signal<Recipe[]>;
  public constructor() {
    const store = inject<Store<State>>(Store);

    this.recipes = store.selectSignal(selectToDoRecipes);
  }
}
