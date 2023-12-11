import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {formNames, RecipesFormNames} from '../../../../core/factories/recipe.factory';
import {Observable, Subscription} from 'rxjs';
import {Ingredient} from '../../../../core/models/ingredient';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {State as RecipesState} from '../../../../core/store/recipes/reducers';
import {selectIngredients} from '../../../../core/store/ingredients/selectors';
import {map, startWith, switchMap} from 'rxjs/operators';
import {recipeErrors, RecipeErrors} from '../../../../core/errors/recipe.error';
import {StringUtils} from '../../../../core/utils/string.utils';
import {selectRecipes} from '../../../../core/store/recipes/selectors';
import {Length} from '../../../../config/form.config';
import {Recipe} from '../../../../core/models/recipe';

@Component({
  selector: 'recipes-positions-part',
  templateUrl: './positions-part.component.html',
  styleUrls: ['./positions-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionsPartComponent implements OnInit, OnDestroy {

  private static measures: string[] = [];
  @Input() public formPart: AbstractControl;
  @Input() public usedIngredients: number[];
  @Input() public usedRecipes: number[];
  public formGroup: FormGroup;
  public formNames: RecipesFormNames;
  public ingredients$: Observable<Ingredient[]>;
  public recipes$: Observable<Recipe[]>;
  public filteredIngredients$: Observable<Ingredient[]>;
  public filteredRecipes$: Observable<Recipe[]>;
  public measureLength$: Observable<number>;
  public errors: RecipeErrors;
  public filteredMeasures: string[];
  public maxMeasureLength: number;
  public maxIngredientNameLength: number;
  @Output() private delete: EventEmitter<void>;
  private readonly ingredientsStore: Store<IngredientsState>;
  private readonly recipesStore: Store<RecipesState>;
  private subscription: Subscription | undefined;

  public constructor(ingredientsStore: Store<IngredientsState>, recipesStore: Store<RecipesState>) {
    this.formNames = formNames;
    this.delete = new EventEmitter<void>();
    this.ingredientsStore = ingredientsStore;
    this.recipesStore = recipesStore;
    this.maxMeasureLength = Length.maxMeasureLength;
    this.maxIngredientNameLength = Length.maxIngredientNameLength;
    this.errors = recipeErrors;
    if (PositionsPartComponent.measures.length === 0) {
      this.recipesStore.select(selectRecipes).subscribe(recipes =>
        recipes.forEach(recipe => recipe.groups.forEach(group => group.positions.forEach(position => {
          if (!PositionsPartComponent.measures.includes(position.measure)) {
            PositionsPartComponent.measures.push(position.measure);
          }
        })))
      ).unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.formGroup = this.formPart as FormGroup;
    this.ingredients$ = this.ingredientsStore.select(selectIngredients)
      .pipe(map(ingredients => ingredients.sort(
        (a, b) => StringUtils.compareString(a.name, b.name)
      )));
    this.recipes$ = this.recipesStore.select(selectRecipes)
      .pipe(map(recipes => recipes.sort((a, b) => StringUtils.compareString(a.name, b.name))));
    const search = this.formPart.get(this.formNames.ingredientSearch) as AbstractControl;
    const search2 = this.formPart.get(this.formNames.measure) as AbstractControl;
    search2.valueChanges.pipe(startWith('')).subscribe(value => {
      this.filteredMeasures = PositionsPartComponent.measures.filter(
        measure => StringUtils.clearPolishCharacters(measure.toLowerCase()).includes(StringUtils.clearPolishCharacters(value.toLowerCase()))
      );
      if (this.filteredMeasures.length === 0 && value.length > 0) {
        this.filteredMeasures.push(`Dodać "${value}"?`);
      }
    });
    this.measureLength$ = (this.formGroup.get(this.formNames.measure) as FormControl).valueChanges.pipe(
      startWith(this.formGroup?.get(this.formNames.measure)?.value ?? ''),
      map(value => value.length)
    );
    this.subscription = this.formGroup?.get(this.formNames.ingredientSearch)?.valueChanges
      .subscribe(() => this.formGroup?.get(this.formNames.ingredient)?.setValue(null));

    this.filteredIngredients$ = search.valueChanges.pipe(
      startWith(''),
      switchMap((value: string) => this.ingredients$.pipe(
        map(ingredients =>
          ingredients.filter(ingredient => {
              let used = this.usedIngredients;
              let index = used.indexOf(this.formPart.get(this.formNames.ingredient)?.value);
              if (index !== -1) {
                used.splice(index, 1);
              }
              return StringUtils.clearPolishCharacters(StringUtils.clearPolishCharacters(ingredient.name.toLowerCase())).includes(StringUtils.clearPolishCharacters(value.toLowerCase()))
                && !used.includes(ingredient.id);
            }
          )
        )
      )));
    this.filteredRecipes$ = search.valueChanges.pipe(
      startWith(''),
      switchMap((value: string) => this.recipes$.pipe(
        map(recipes =>
          recipes.filter(recipe => {
              let used = this.usedRecipes;
              let index = used.indexOf(this.formPart.get(this.formNames.ingredient)?.value);
              if (index !== -1) {
                used.splice(index, 1);
              }
              return StringUtils.clearPolishCharacters(StringUtils.clearPolishCharacters(recipe.name.toLowerCase())).includes(StringUtils.clearPolishCharacters(value.toLowerCase()))
                && !used.includes(recipe.id);
            }
          )
        )
      )));
  }

  public deletePosition(): void {
    this.delete.emit();
  }

  public selectIngredient(ingredient: number): void {
    this.formPart.get(this.formNames.ingredient)?.setValue(ingredient);
    this.formPart.get(this.formNames.type)?.setValue('ingredient');
  }

  public selectRecipe(recipe: number): void {
    this.formPart.get(this.formNames.ingredient)?.setValue(recipe);
    this.formPart.get(this.formNames.type)?.setValue('recipe');
  }

  public selectMeasure(measure: string): void {
    if (measure.startsWith('Dodać "') && measure.endsWith('"?')) {
      measure = measure.slice(7, measure.length - 2);
      PositionsPartComponent.measures.push(measure);
      PositionsPartComponent.measures.sort((a, b) => StringUtils.compareString(a, b));
    }
    this.formPart.get(this.formNames.measure)?.setValue(measure);
  }

  public ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
