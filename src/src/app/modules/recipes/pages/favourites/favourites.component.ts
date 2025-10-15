import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { State } from '../../../../core/store/recipes/reducers';
import { selectFavouriteRecipes } from '../../../../core/store/recipes/selectors';
import { RecipesListComponent } from '../../components/recipes-list/recipes-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent],
  selector: 'recipes-pages-favourites',
  standalone: true,
  styleUrls: [],
  templateUrl: './favourites.component.html',
})
export class FavouritesComponent {
  public recipes: Signal<Recipe[]>;
  public constructor(store: Store<State>) {
    this.recipes = store.selectSignal(selectFavouriteRecipes);
  }
}
