import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {selectFavouriteRecipes} from '../../../../core/store/recipes/selectors';

@Component({
  selector: 'recipes-pages-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesComponent {

  public recipes$: Observable<Recipe[]>;

  public constructor(store: Store<State>) {
    this.recipes$ = store.select(selectFavouriteRecipes);
  }
}
