import type { OnDestroy, OnInit, WritableSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { Tag } from '@/app/core/models/tag';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as TagsState } from '@/app/core/store/tags/reducers';

import { Length } from '@/app/config/form.config';
import { RecipesSearchService } from '@/app/core/services/recipes-search.service';
import { SearchService } from '@/app/core/services/search.service';
import { selectIngredients } from '@/app/core/store/ingredients/selectors';
import { selectTags } from '@/app/core/store/tags/selectors';
import { StringUtils } from '@/app/core/utils/string.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

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
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit, OnDestroy {
  private static available: boolean | null = null;
  private static searchFavourite: boolean | null = null;
  private static searchHasLink: boolean | null = null;
  private static searchIngredients: number[] = [];
  private static searchName = '';
  private static searchTags: number[] = [];
  private static searchToDo: boolean | null = null;
  public filteredIngredients: WritableSignal<Ingredient[]> = signal<Ingredient[]>([]);
  public filteredTags: WritableSignal<Tag[]> = signal<Tag[]>([]);
  public maxNameLength: number = Length.maxRecipeNameLength;
  public selectedAvailable: FormControl;
  public selectedFavourite: FormControl;
  public selectedHasLink: FormControl;
  public selectedIngredients: FormControl;
  public selectedName: FormControl;
  public selectedTags: FormControl;
  public selectedToDo: FormControl;
  private ingredientSearch: WritableSignal<string> = signal<string>('');
  private tagSearch: WritableSignal<string> = signal<string>('');
  private ingredientsState: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private recipesSearchService: RecipesSearchService = inject(RecipesSearchService);
  private searchService: SearchService = inject(SearchService);
  private tagsState: Store<TagsState> = inject<Store<TagsState>>(Store);
  public constructor() {
    super();
    this.selectedTags = new FormControl(SearchComponent.searchTags);
    this.selectedIngredients = new FormControl(SearchComponent.searchIngredients);
    this.selectedName = new FormControl(SearchComponent.searchName);
    this.selectedFavourite = new FormControl(SearchComponent.searchFavourite);
    this.selectedToDo = new FormControl(SearchComponent.searchToDo);
    this.selectedHasLink = new FormControl(SearchComponent.searchHasLink);
    this.selectedAvailable = new FormControl(SearchComponent.available);
  }

  public ngOnInit(): void {
    const ingredients = this.ingredientsState.selectSignal(selectIngredients);
    const tags = this.tagsState.selectSignal(selectTags);

    this.onSignalValue(
      (search: string) =>
        this.filteredIngredients.set(
          ingredients().filter((ingredient: Ingredient) => StringUtils.stringIncludes(ingredient.name, search)),
        ),
      this.ingredientSearch,
    );

    this.onSignalValue(
      (search: string) =>
        this.filteredTags.set(tags().filter((tag: Tag) => StringUtils.stringIncludes(tag.name, search))),
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
