import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {IngredientsSearchService} from '../../../../core/services/ingredients-search/ingredients-search.service';
import {SearchService} from '../../../../core/services/search/search.service';
import {Length} from '../../../../config/form.config';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'ingredients-search',
  templateUrl: './search.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static searchName: string = '';
  private static searchAvailable: boolean | null = null;
  public name: FormControl;
  public available: FormControl;
  public maxNameLength: number;
  private ingredientsSearchService: IngredientsSearchService;
  private searchService: SearchService;
  private subscriptions: Subscription[];

  public constructor(ingredientsSearchService: IngredientsSearchService, searchService: SearchService) {
    this.name = new FormControl();
    this.available = new FormControl();
    this.name.setValue(SearchComponent.searchName);
    this.available.setValue(SearchComponent.searchAvailable);
    this.ingredientsSearchService = ingredientsSearchService;
    this.searchService = searchService;
    this.maxNameLength = Length.maxIngredientNameLength;
  }

  public ngOnInit(): void {
    this.subscriptions = [
      this.name.valueChanges.subscribe(() => this.search()),
      this.available.valueChanges.subscribe(() => this.search())
    ];
    if (this.isUpdated()) {
      this.search();
    }
  }

  public search(): void {
    this.ingredientsSearchService.searchIngredients({
      name: this.name.value,
      available: this.available.value
    });
    this.emitSearch();
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.name.value;
    SearchComponent.searchAvailable = this.available.value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public clear(): void {
    this.name.setValue('');
    this.available.setValue(null);
    this.emitSearch();
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }

  private isUpdated(): boolean {
    return this.name.value !== '' || this.available.value !== null;
  }
}
