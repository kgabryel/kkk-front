import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {selectToDoRecipes} from '../../../../core/store/recipes/selectors';

@Component({
  selector: 'recipes-pages-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToDoComponent {

  public recipes$: Observable<Recipe[]>;

  public constructor(store: Store<State>) {
    this.recipes$ = store.select(selectToDoRecipes);
  }
}
