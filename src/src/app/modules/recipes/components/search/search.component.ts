import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from '../../../../core/services/search/search.service';
import {Observable, Subscription} from 'rxjs';
import {Tag} from '../../../../core/models/tag';
import {Ingredient} from '../../../../core/models/ingredient';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {State as TagsState} from '../../../../core/store/tags/reducers';
import {Store} from '@ngrx/store';
import {selectIngredients} from '../../../../core/store/ingredients/selectors';
import {selectTags} from '../../../../core/store/tags/selectors';
import {map} from 'rxjs/operators';
import {RecipesSearchService} from '../../../../core/services/recipes-search/recipes-search.service';
import {FormControl} from '@angular/forms';
import {Length} from '../../../../config/form.config';
import {StringUtils} from '../../../../core/utils/string.utils';

@Component({
  selector: 'recipes-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static searchName: string = '';
  private static searchFavourite: boolean | null = null;
  private static searchToDo: boolean | null = null;
  private static searchHasLink: boolean | null = null;
  private static searchTags: number[] = [];
  private static searchIngredients: number[] = [];
  private static available: boolean | null = null;

  public selectedName: FormControl;
  public selectedFavourite: FormControl;
  public selectedToDo: FormControl;
  public selectedHasLink: FormControl;
  public selectedTags: FormControl;
  public selectedAvailable: FormControl;
  public selectedIngredients: FormControl;
  public tags$: Observable<Tag[]>;
  public ingredients$: Observable<Ingredient[]>;
  public maxNameLength: number;
  private recipesSearchService: RecipesSearchService;
  private searchService: SearchService;
  private ingredientsState: Store<IngredientsState>;
  private tagsState: Store<TagsState>;
  private subscriptions: Subscription[];

  public constructor(
    recipesSearchService: RecipesSearchService,
    searchService: SearchService,
    ingredientsState: Store<IngredientsState>,
    tagsState: Store<TagsState>
  ) {
    this.selectedTags = new FormControl();
    this.selectedIngredients = new FormControl();
    this.selectedName = new FormControl();
    this.selectedFavourite = new FormControl();
    this.selectedToDo = new FormControl();
    this.selectedHasLink = new FormControl();
    this.selectedAvailable = new FormControl();
    this.ingredientsState = ingredientsState;
    this.tagsState = tagsState;
    this.selectedFavourite.setValue(SearchComponent.searchFavourite);
    this.selectedToDo.setValue(SearchComponent.searchToDo);
    this.selectedHasLink.setValue(SearchComponent.searchHasLink);
    this.selectedTags.setValue(SearchComponent.searchTags);
    this.selectedIngredients.setValue(SearchComponent.searchIngredients);
    this.selectedName.setValue(SearchComponent.searchName);
    this.selectedAvailable.setValue(SearchComponent.available);
    this.recipesSearchService = recipesSearchService;
    this.searchService = searchService;
    this.maxNameLength = Length.maxRecipeNameLength;
  }

  public ngOnInit(): void {
    this.ingredients$ = this.ingredientsState.select(selectIngredients)
      .pipe(map(ingredients => ingredients.sort(
        (a, b) => StringUtils.compareString(a.name, b.name)
      )));
    this.tags$ = this.tagsState.select(selectTags)
      .pipe(map(tags => tags.sort(
        (a, b) => StringUtils.compareString(a.name, b.name)
      )));
    this.subscriptions = [
      this.selectedFavourite.valueChanges.subscribe(() => this.search()),
      this.selectedToDo.valueChanges.subscribe(() => this.search()),
      this.selectedHasLink.valueChanges.subscribe(() => this.search()),
      this.selectedTags.valueChanges.subscribe(() => this.search()),
      this.selectedIngredients.valueChanges.subscribe(() => this.search()),
      this.selectedName.valueChanges.subscribe(() => this.search()),
      this.selectedAvailable.valueChanges.subscribe(() => this.search())
    ];
    if (this.isUpdated()) {
      this.search();
    }
  }

  public clear(): void {
    this.selectedName.setValue('');
    this.selectedFavourite.setValue(null);
    this.selectedToDo.setValue(null);
    this.selectedHasLink.setValue(null);
    this.selectedTags.setValue([]);
    this.selectedIngredients.setValue([]);
    this.selectedAvailable.setValue(null);
    this.emitSearch();
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.selectedName.value;
    SearchComponent.searchFavourite = this.selectedFavourite.value;
    SearchComponent.searchToDo = this.selectedToDo.value;
    SearchComponent.searchHasLink = this.selectedHasLink.value;
    SearchComponent.searchTags = this.selectedTags.value;
    SearchComponent.searchIngredients = this.selectedIngredients.value;
    SearchComponent.available = this.selectedAvailable.value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public search(): void {
    this.recipesSearchService.searchRecipe({
      name: this.selectedName.value,
      favourite: this.selectedFavourite.value,
      toDo: this.selectedToDo.value,
      hasLink: this.selectedHasLink.value,
      tags: this.selectedTags.value,
      ingredients: this.selectedIngredients.value,
      available: this.selectedAvailable.value
    });
    this.emitSearch();
  }

  public filterTags(event: string): void {
    this.tags$ = this.tagsState.select(selectTags).pipe(
      map(tags => tags.filter(tag => StringUtils.stringIncludes(tag.name, event)))
    );
  }

  public filterIngredients(event: string): void {
    this.ingredients$ = this.ingredientsState.select(selectIngredients).pipe(
      map(ingredients => ingredients.filter(ingredient => StringUtils.stringIncludes(ingredient.name, event)))
    );
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }

  private isUpdated(): boolean {
    return this.selectedName.value !== '' ||
      this.selectedFavourite.value !== null ||
      this.selectedToDo.value !== null ||
      this.selectedHasLink.value !== null ||
      this.selectedTags.value.length > 0 ||
      this.selectedIngredients.value.length > 0 ||
      this.selectedAvailable.value !== null;
  }
}
