import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';

import type { MenuConfig } from '@/app/config/menu.config';
import type { Names } from '@/app/config/recipes-menu.config';
import type { Recipe } from '@/app/core/models/recipe';
import type { State } from '@/app/core/store/recipes/reducers';

import { ItemNames, MenuItems } from '@/app/config/recipes-menu.config';
import { selectFavouriteRecipes, selectToDoRecipes } from '@/app/core/store/recipes/selectors';
import { SignalUtils } from '@/app/core/utils/signal.utils';
import { NavigationItemComponent } from '@/app/modules/recipes/components/navigation-item/navigation-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, NavigationItemComponent],
  selector: 'recipes-navigation',
  styleUrl: './navigation.component.scss',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  public favouritesDisabled!: Signal<boolean>;
  public menuItems: Map<string, MenuConfig> = MenuItems;
  public menuNames: Names = ItemNames;
  public toDoDisabled!: Signal<boolean>;
  private store: Store<State> = inject<Store<State>>(Store);

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
