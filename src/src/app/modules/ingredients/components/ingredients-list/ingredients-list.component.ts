import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatList } from '@angular/material/list';
import { Store } from '@ngrx/store';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { Search } from '@/app/core/services/ingredients-search.service';
import type { State as IngredientState } from '@/app/core/store/ingredients/reducers';
import type { State as SettingsState } from '@/app/core/store/settings/reducers';

import { IngredientsSearchService } from '@/app/core/services/ingredients-search.service';
import { searchIngredients } from '@/app/core/store/ingredients/selectors';
import { selectOzaKey } from '@/app/core/store/settings/selectors';
import { SearchUtils } from '@/app/core/utils/search.utils';
import { IngredientContainerComponent } from '@/app/modules/ingredients/components/ingredient-container/ingredient-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IngredientContainerComponent, MatList],
  selector: 'ingredients-ingredients-list',
  styleUrl: './ingredients-list.component.scss',
  templateUrl: './ingredients-list.component.html',
})
export class IngredientsListComponent implements OnInit {
  public ingredients!: Signal<Ingredient[]>;
  public ozaKey!: Signal<string | null>;
  private readonly ingredientsSearchService: IngredientsSearchService = inject(IngredientsSearchService);
  private readonly ingredientStore: Store<IngredientState> = inject<Store<IngredientState>>(Store);
  private settingsStore: Store<SettingsState> = inject<Store<SettingsState>>(Store);

  public ngOnInit(): void {
    this.ingredients = SearchUtils.search<Search, Ingredient, IngredientState>(
      this.ingredientsSearchService,
      this.ingredientStore,
      (search: Search) => searchIngredients(search),
    );
    this.ozaKey = this.settingsStore.selectSignal(selectOzaKey);
  }
}
