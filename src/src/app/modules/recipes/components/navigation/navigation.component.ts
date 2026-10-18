import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ItemNames, MenuItems, Names} from '../../../../config/recipes-menu.config';
import {MenuConfig} from '../../../../config/menu.config';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {selectFavouriteRecipes, selectToDoRecipes} from '../../../../core/store/recipes/selectors';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'recipes-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {

  public menuItems: Map<string, MenuConfig>;
  public menuNames: Names;
  public toDoDisabled$: Observable<boolean>;
  public favouritesDisabled$: Observable<boolean>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.menuItems = MenuItems;
    this.menuNames = ItemNames;
    this.store = store;

  }

  public ngOnInit(): void {
    this.toDoDisabled$ = this.store.select(selectToDoRecipes).pipe(map(recipes => recipes.length === 0));
    this.favouritesDisabled$ = this.store.select(selectFavouriteRecipes).pipe(map(recipes => recipes.length === 0));
  }
}
