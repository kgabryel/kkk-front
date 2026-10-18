import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';

import { Length } from '../../../../config/form.config';
import { Ingredient } from '../../../../core/models/ingredient';
import { Tag } from '../../../../core/models/tag';
import { RecipesSearchService } from '../../../../core/services/recipes-search.service';
import { SearchService } from '../../../../core/services/search.service';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import { selectIngredients } from '../../../../core/store/ingredients/selectors';
import { State as TagsState } from '../../../../core/store/tags/reducers';
import { selectTags } from '../../../../core/store/tags/selectors';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { StringUtils } from '../../../../core/utils/string.utils';
import { BaseComponent } from '../../../base.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogClose,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    AutocompletePipe,
    MatInput,
    MatSelect,
    MatOption,
    FormsModule,
    MatSelectSearchComponent,
  ],
  selector: 'recipes-search',
  standalone: true,
  styleUrls: [],
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit, OnDestroy {
  private static available: boolean | null = null;
  private static searchFavourite: boolean | null = null;
  private static searchHasLink: boolean | null = null;
  private static searchIngredients: number[] = [];
  private static searchName: string = '';
  private static searchTags: number[] = [];
  private static searchToDo: boolean | null = null;
  public filteredIngredients: WritableSignal<Ingredient[]> = signal<Ingredient[]>([]);
  public filteredTags: WritableSignal<Tag[]> = signal<Tag[]>([]);
  public maxNameLength: number;
  public selectedAvailable: FormControl;
  public selectedFavourite: FormControl;
  public selectedHasLink: FormControl;
  public selectedIngredients: FormControl;
  public selectedName: FormControl;
  public selectedTags: FormControl;
  public selectedToDo: FormControl;
  private ingredientSearch: WritableSignal<string> = signal<string>('');
  private tagSearch: WritableSignal<string> = signal<string>('');
  private ingredientsState: Store<IngredientsState>;
  private recipesSearchService: RecipesSearchService;
  private searchService: SearchService;
  private tagsState: Store<TagsState>;
  public constructor(
    recipesSearchService: RecipesSearchService,
    searchService: SearchService,
    ingredientsState: Store<IngredientsState>,
    tagsState: Store<TagsState>,
  ) {
    super();
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
    const ingredients = SignalUtils.map<Ingredient[], Ingredient[]>(
      this.ingredientsState.selectSignal(selectIngredients),
      (ingredients: Ingredient[]) =>
        ingredients.sort((a: Ingredient, b: Ingredient) =>
          StringUtils.compareString(a.name, b.name),
        ),
    );

    const tags = SignalUtils.map<Tag[], Tag[]>(
      this.tagsState.selectSignal(selectTags),
      (tags: Tag[]) => tags.sort((a: Tag, b: Tag) => StringUtils.compareString(a.name, b.name)),
    );

    this.onSignalValue(
      (search: string) =>
        this.filteredIngredients.set(
          ingredients().filter((ingredient: Ingredient) =>
            StringUtils.stringIncludes(ingredient.name, search),
          ),
        ),
      this.ingredientSearch,
    );

    this.onSignalValue(
      (search: string) =>
        this.filteredTags.set(
          tags().filter((tag: Tag) => StringUtils.stringIncludes(tag.name, search)),
        ),
      this.tagSearch,
    );

    this.onObservable(
      () => this.search(),
      this.selectedFavourite.valueChanges,
      this.selectedToDo.valueChanges,
      this.selectedHasLink.valueChanges,
      this.selectedTags.valueChanges,
      this.selectedIngredients.valueChanges,
      this.selectedName.valueChanges,
      this.selectedAvailable.valueChanges,
    );

    if (this.isUpdated()) {
      this.search();
    }
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.selectedName.value;
    SearchComponent.searchFavourite = this.selectedFavourite.value;
    SearchComponent.searchToDo = this.selectedToDo.value;
    SearchComponent.searchHasLink = this.selectedHasLink.value;
    SearchComponent.searchTags = this.selectedTags.value;
    SearchComponent.searchIngredients = this.selectedIngredients.value;
    SearchComponent.available = this.selectedAvailable.value;
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
  public filterIngredients(event: string): void {
    this.ingredientSearch.set(event);
  }

  public filterTags(event: string): void {
    this.tagSearch.set(event);
  }

  public search(): void {
    this.recipesSearchService.searchRecipe({
      available: this.selectedAvailable.value,
      favourite: this.selectedFavourite.value,
      hasLink: this.selectedHasLink.value,
      ingredients: this.selectedIngredients.value,
      name: this.selectedName.value,
      tags: this.selectedTags.value,
      toDo: this.selectedToDo.value,
    });
    this.emitSearch();
  }

  private isUpdated(): boolean {
    return (
      this.selectedName.value !== '' ||
      this.selectedFavourite.value !== null ||
      this.selectedToDo.value !== null ||
      this.selectedHasLink.value !== null ||
      this.selectedTags.value.length > 0 ||
      this.selectedIngredients.value.length > 0 ||
      this.selectedAvailable.value !== null
    );
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }
}
