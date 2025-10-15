import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatOption } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-unified';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';

import { Month, months } from '../../../../config/months.config';
import { Ingredient } from '../../../../core/models/ingredient';
import { SearchService } from '../../../../core/services/search.service';
import { SeasonsSearchService } from '../../../../core/services/seasons-search.service';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import { selectIngredientsWithSeason } from '../../../../core/store/ingredients/selectors';
import { State as SeasonsState } from '../../../../core/store/seasons/reducers';
import { StringUtils } from '../../../../core/utils/string.utils';
import { BaseComponent } from '../../../base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogClose,
    MatIcon,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatSelectSearchComponent,
  ],
  selector: 'seasons-search',
  standalone: true,
  styleUrls: [],
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit, OnDestroy {
  private static searchIngredients: number[] = [];
  private static searchMonths: number[] = [];
  public ingredients!: Signal<Ingredient[]>;
  public searchValue: WritableSignal<string> = signal<string>('');
  public months: Month[];
  public seasonsStore: Store<SeasonsState>;
  public selectedIngredients: FormControl;
  public selectedMonths: FormControl;
  private ingredientsStore: Store<IngredientsState>;
  private searchService: SearchService;
  private seasonsSearchService: SeasonsSearchService;
  public constructor(
    ingredientsStore: Store<IngredientsState>,
    seasonsStore: Store<SeasonsState>,
    seasonsSearchService: SeasonsSearchService,
    searchService: SearchService,
  ) {
    super();
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
    const query = this.ingredientsStore.selectSignal(selectIngredientsWithSeason);
    this.ingredients = computed(() => {
      const search = this.searchValue();
      const all = query();
      const filtered = all.filter((i: Ingredient) => StringUtils.stringIncludes(i.name, search));

      return [...filtered].sort((a: Ingredient, b: Ingredient) =>
        StringUtils.compareString(a.name, b.name),
      );
    });

    this.onObservable(
      () => this.search(),
      this.selectedIngredients.valueChanges,
      this.selectedMonths.valueChanges,
    );

    if (this.isUpdated()) {
      this.search();
    }
  }

  public ngOnDestroy(): void {
    SearchComponent.searchIngredients = this.selectedIngredients.value;
    SearchComponent.searchMonths = this.selectedMonths.value;
  }

  public clear(): void {
    this.selectedIngredients.setValue([]);
    this.selectedMonths.setValue([]);
    this.emitSearch();
  }

  public filterIngredients(event: string): void {
    this.searchValue.set(event);
  }

  public search(): void {
    this.seasonsSearchService.searchSeason({
      ingredients: this.selectedIngredients.value,
      months: this.selectedMonths.value,
    });
    this.emitSearch();
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }

  private isUpdated(): boolean {
    return this.selectedIngredients.value.length > 0 || this.selectedMonths.value.length > 0;
  }
}
