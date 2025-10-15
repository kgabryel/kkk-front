import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';

import { Length } from '../../../../config/form.config';
import { IngredientsSearchService } from '../../../../core/services/ingredients-search.service';
import { SearchService } from '../../../../core/services/search.service';
import { BaseComponent } from '../../../base.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatDialogClose,
    MatIcon,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    AutocompletePipe,
    MatSelect,
    MatOption,
    MatInput,
  ],
  selector: 'ingredients-search',
  standalone: true,
  styleUrls: [],
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit, OnDestroy {
  private static searchAvailable: boolean | null = null;
  private static searchName: string = '';
  public available: FormControl;
  public maxNameLength: number;
  public name: FormControl;
  private ingredientsSearchService: IngredientsSearchService;
  private searchService: SearchService;
  public constructor(
    ingredientsSearchService: IngredientsSearchService,
    searchService: SearchService,
  ) {
    super();
    this.name = new FormControl();
    this.available = new FormControl();
    this.name.setValue(SearchComponent.searchName);
    this.available.setValue(SearchComponent.searchAvailable);
    this.ingredientsSearchService = ingredientsSearchService;
    this.searchService = searchService;
    this.maxNameLength = Length.maxIngredientNameLength;
  }

  public ngOnInit(): void {
    this.onObservable(() => this.search(), this.name.valueChanges, this.available.valueChanges);

    if (this.isUpdated()) {
      this.search();
    }
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.name.value;
    SearchComponent.searchAvailable = this.available.value;
  }

  public clear(): void {
    this.name.setValue('');
    this.available.setValue(null);
    this.emitSearch();
  }

  public search(): void {
    this.ingredientsSearchService.searchIngredients({
      available: this.available.value,
      name: this.name.value,
    });
    this.emitSearch();
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }

  private isUpdated(): boolean {
    return this.name.value !== '' || this.available.value !== null;
  }
}
