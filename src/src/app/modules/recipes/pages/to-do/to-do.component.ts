import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { State } from '../../../../core/store/recipes/reducers';
import { selectToDoRecipes } from '../../../../core/store/recipes/selectors';
import { RecipesListComponent } from '../../components/recipes-list/recipes-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent],
  selector: 'recipes-pages-to-do',
  standalone: true,
  styleUrls: [],
  templateUrl: './to-do.component.html',
})
export class ToDoComponent {
  public recipes: Signal<Recipe[]>;
  public constructor(store: Store<State>) {
    this.recipes = store.selectSignal(selectToDoRecipes);
  }
}
