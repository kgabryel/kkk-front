import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Ingredient} from '../../../../core/models/ingredient';
import {Store} from '@ngrx/store';
import {State as IngredientState} from '../../../../core/store/ingredients/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {searchIngredients} from '../../../../core/store/ingredients/selectors';
import {IngredientsSearchService} from '../../../../core/services/ingredients-search/ingredients-search.service';
import {map, switchMap} from 'rxjs/operators';
import {selectOzaKey} from '../../../../core/store/settings/selectors';
import {StringUtils} from '../../../../core/utils/string.utils';

@Component({
  selector: 'ingredients-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientsListComponent implements OnInit {

  public ingredients$: Observable<Ingredient[]>;
  public ozaKey$: Observable<string | null>;
  private ingredientStore: Store<IngredientState>;
  private ingredientsSearchService: IngredientsSearchService;
  private settingsStore: Store<SettingsState>;

  public constructor(
    ingredientStore: Store<IngredientState>,
    ingredientsSearchService: IngredientsSearchService,
    settingsStore: Store<SettingsState>
  ) {
    this.ingredientStore = ingredientStore;
    this.ingredientsSearchService = ingredientsSearchService;
    this.settingsStore = settingsStore;
  }

  public ngOnInit(): void {
    this.ingredients$ = this.ingredientsSearchService.getState().pipe(
      switchMap(search => this.ingredientStore.select(searchIngredients(search))),
      map(ingredients => ingredients.sort((a, b) => StringUtils.compareString(a.name, b.name)))
    );
    this.ozaKey$ = this.settingsStore.select(selectOzaKey);
  }
}
