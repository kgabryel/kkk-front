import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Ingredient} from '../../../../core/models/ingredient';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {State as SeasonsState} from '../../../../core/store/seasons/reducers';
import {selectSeasons} from '../../../../core/store/seasons/selectors';
import {map, switchMap} from 'rxjs/operators';
import {selectIngredientsWithAssignedSeason} from '../../../../core/store/ingredients/selectors';
import {Month, months} from '../../../../config/months.config';
import cloneDeep from 'lodash/cloneDeep';
import {SeasonsSearchService} from '../../../../core/services/seasons-search/seasons-search.service';
import {SearchService} from '../../../../core/services/search/search.service';
import {StringUtils} from '../../../../core/utils/string.utils';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'seasons-search',
  templateUrl: './search.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  private static searchMonths: number[] = [];
  private static searchIngredients: number[] = [];
  public ingredients$: Observable<Ingredient[]>;
  public seasonsStore: Store<SeasonsState>;
  public months: Month[];
  public selectedIngredients: FormControl;
  public selectedMonths: FormControl;
  private ingredientsStore: Store<IngredientsState>;
  private seasonsSearchService: SeasonsSearchService;
  private searchService: SearchService;
  private subscriptions: Subscription[];

  public constructor(
    ingredientsStore: Store<IngredientsState>,
    seasonsStore: Store<SeasonsState>,
    seasonsSearchService: SeasonsSearchService,
    searchService: SearchService
  ) {
    this.selectedIngredients = new FormControl();
    this.selectedMonths = new FormControl();
    this.ingredientsStore = ingredientsStore;
    this.seasonsStore = seasonsStore;
    this.months = cloneDeep(months);
    this.seasonsSearchService = seasonsSearchService;
    this.searchService = searchService;
  }

  public ngOnInit(): void {
    this.selectedIngredients.setValue(SearchComponent.searchIngredients);
    this.selectedMonths.setValue(SearchComponent.searchMonths);
    this.ingredients$ = this.seasonsStore.select(selectSeasons).pipe(
      map(seasons => seasons.map(season => season.ingredientId)),
      switchMap(usedIngredients => this.ingredientsStore.select(
        selectIngredientsWithAssignedSeason(usedIngredients)
      ))).pipe(
      map(ingredients => ingredients.sort(
        (a, b) => StringUtils.compareString(a.name, b.name)
      )));
    this.subscriptions = [
      this.selectedIngredients.valueChanges.subscribe(() => this.search()),
      this.selectedMonths.valueChanges.subscribe(() => this.search())
    ];
    if (this.isUpdated()) {
      this.search();
    }
  }

  public ngOnDestroy(): void {
    SearchComponent.searchIngredients = this.selectedIngredients.value;
    SearchComponent.searchMonths = this.selectedMonths.value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public search(): void {
    this.seasonsSearchService.searchSeason({
      ingredients: this.selectedIngredients.value,
      months: this.selectedMonths.value
    });
    this.emitSearch();
  }

  public clear(): void {
    this.selectedIngredients.setValue([]);
    this.selectedMonths.setValue([]);
    this.emitSearch();
  }

  public filterIngredients(event: string): void {
    this.ingredients$ = this.seasonsStore.select(selectSeasons).pipe(
      map(seasons => seasons.map(season => season.ingredientId)),
      switchMap(usedIngredients => this.ingredientsStore.select(selectIngredientsWithAssignedSeason(usedIngredients)))
    ).pipe(
      map(ingredients => ingredients.filter(ingredient => StringUtils.stringIncludes(ingredient.name, event))),
      map(ingredients => ingredients.sort((a, b) => StringUtils.compareString(a.name, b.name)))
    );
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }

  private isUpdated(): boolean {
    return this.selectedIngredients.value.length > 0 || this.selectedMonths.value.length > 0;
  }
}
