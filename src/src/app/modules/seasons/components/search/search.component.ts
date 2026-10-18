import type { OnDestroy, OnInit, Signal, WritableSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatOption } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-unified';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';

import type { Month } from '@/app/config/months.config';
import type { Ingredient } from '@/app/core/models/ingredient';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as SeasonsState } from '@/app/core/store/seasons/reducers';

import { months } from '@/app/config/months.config';
import { SearchService } from '@/app/core/services/search.service';
import { SeasonsSearchService } from '@/app/core/services/seasons-search.service';
import { selectIngredientsWithSeason } from '@/app/core/store/ingredients/selectors';
import { StringUtils } from '@/app/core/utils/string.utils';
import { BaseComponent } from '@/app/modules/base.component';

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
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit, OnDestroy {
  private static searchIngredients: number[] = [];
  private static searchMonths: number[] = [];
  public ingredients!: Signal<Ingredient[]>;
  public searchValue: WritableSignal<string> = signal<string>('');
  public months: Month[];
  public seasonsStore: Store<SeasonsState> = inject<Store<SeasonsState>>(Store);
  public selectedIngredients: FormControl;
  public selectedMonths: FormControl;
  private ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private searchService: SearchService = inject(SearchService);
  private seasonsSearchService: SeasonsSearchService = inject(SeasonsSearchService);
  public constructor() {
    super();
    this.selectedIngredients = new FormControl();
    this.selectedMonths = new FormControl();
    this.months = cloneDeep(months);
  }

  public ngOnInit(): void {
    this.selectedIngredients.setValue(SearchComponent.searchIngredients);
    this.selectedMonths.setValue(SearchComponent.searchMonths);
    const query = this.ingredientsStore.selectSignal(selectIngredientsWithSeason);
    this.ingredients = computed(() => {
      const search = this.searchValue();
      const all = query();

      return all.filter((i: Ingredient) => StringUtils.stringIncludes(i.name, search));
    });

    this.onObservable(() => this.search(), this.selectedIngredients.valueChanges, this.selectedMonths.valueChanges);

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
