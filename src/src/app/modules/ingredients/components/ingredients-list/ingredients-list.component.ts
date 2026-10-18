import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatList } from '@angular/material/list';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../../../core/models/ingredient';
import {
  IngredientsSearchService,
  Search,
} from '../../../../core/services/ingredients-search.service';
import { State as IngredientState } from '../../../../core/store/ingredients/reducers';
import { searchIngredients } from '../../../../core/store/ingredients/selectors';
import { State as SettingsState } from '../../../../core/store/settings/reducers';
import { selectOzaKey } from '../../../../core/store/settings/selectors';
import { SearchUtils } from '../../../../core/utils/search.utils';
import { IngredientContainerComponent } from '../ingredient-container/ingredient-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IngredientContainerComponent, MatList],
  selector: 'ingredients-ingredients-list',
  standalone: true,
  styleUrls: ['./ingredients-list.component.scss'],
  templateUrl: './ingredients-list.component.html',
})
export class IngredientsListComponent implements OnInit {
  public ingredients!: Signal<Ingredient[]>;
  public ozaKey!: Signal<string | null>;
  private readonly ingredientsSearchService: IngredientsSearchService;
  private readonly ingredientStore: Store<IngredientState>;
  private settingsStore: Store<SettingsState>;
  public constructor(
    ingredientStore: Store<IngredientState>,
    ingredientsSearchService: IngredientsSearchService,
    settingsStore: Store<SettingsState>,
  ) {
    this.ingredientStore = ingredientStore;
    this.ingredientsSearchService = ingredientsSearchService;
    this.settingsStore = settingsStore;
  }

  public ngOnInit(): void {
    this.ingredients = SearchUtils.search<Search, Ingredient, IngredientState>(
      this.ingredientsSearchService,
      this.ingredientStore,
      (search: Search) => searchIngredients(search),
    );
    this.ozaKey = this.settingsStore.selectSignal(selectOzaKey);
  }
}
