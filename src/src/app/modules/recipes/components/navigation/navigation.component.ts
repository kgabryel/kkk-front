import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';

import { MenuConfig } from '../../../../config/menu.config';
import { ItemNames, MenuItems, Names } from '../../../../config/recipes-menu.config';
import { Recipe } from '../../../../core/models/recipe';
import { State } from '../../../../core/store/recipes/reducers';
import {
  selectFavouriteRecipes,
  selectToDoRecipes,
} from '../../../../core/store/recipes/selectors';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { NavigationItemComponent } from '../navigation-item/navigation-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, NavigationItemComponent],
  selector: 'recipes-navigation',
  standalone: true,
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  public favouritesDisabled!: Signal<boolean>;
  public menuItems: Map<string, MenuConfig>;
  public menuNames: Names;
  public toDoDisabled!: Signal<boolean>;
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.menuItems = MenuItems;
    this.menuNames = ItemNames;
    this.store = store;
  }

  public ngOnInit(): void {
    this.toDoDisabled = SignalUtils.map<Recipe[], boolean>(
      this.store.selectSignal(selectToDoRecipes),
      (recipes: Recipe[]) => recipes.length === 0,
    );
    this.favouritesDisabled = SignalUtils.map<Recipe[], boolean>(
      this.store.selectSignal(selectFavouriteRecipes),
      (recipes: Recipe[]) => recipes.length === 0,
    );
  }
}
