import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  OnInit,
  output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOptgroup,
  MatOption,
} from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { Length } from '../../../../config/form.config';
import { recipeErrors, RecipeErrors } from '../../../../core/errors/recipe.error';
import { formNames, RecipesFormNames } from '../../../../core/factories/recipe.factory';
import { Ingredient } from '../../../../core/models/ingredient';
import { Recipe, RecipePosition, RecipePositionsGroup } from '../../../../core/models/recipe';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import { selectIngredients } from '../../../../core/store/ingredients/selectors';
import { State as RecipesState } from '../../../../core/store/recipes/reducers';
import { selectRecipes } from '../../../../core/store/recipes/selectors';
import { FormUtils } from '../../../../core/utils/form.utils';
import { StringUtils } from '../../../../core/utils/string.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    ErrorsContainerComponent,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatButton,
    MatIcon,
    MatSlideToggle,
    MatOptgroup,
  ],
  selector: 'recipes-positions-part',
  standalone: true,
  styleUrls: ['./positions-part.component.scss'],
  templateUrl: './positions-part.component.html',
})
export class PositionsPartComponent extends BaseComponent implements OnInit {
  private static measures: string[] = [];
  public formPart: InputSignal<AbstractControl> = input.required<AbstractControl>();
  public usedIngredients: InputSignal<number[]> = input.required<number[]>();
  public usedRecipes: InputSignal<number[]> = input.required<number[]>();
  public delete = output<void>();
  public errors: RecipeErrors;
  public filteredIngredients: WritableSignal<Ingredient[]> = signal<Ingredient[]>([]);
  public filteredMeasures: WritableSignal<string[]> = signal<string[]>([]);
  public filteredRecipes: WritableSignal<Recipe[]> = signal<Recipe[]>([]);
  public formGroup!: FormGroup;
  public formNames: RecipesFormNames;
  public ingredients!: Signal<Ingredient[]>;
  public maxIngredientNameLength: number;
  public maxMeasureLength: number;
  public measureLength!: Signal<number>;
  public recipes!: Signal<Recipe[]>;
  private readonly ingredientsStore: Store<IngredientsState>;
  private readonly recipesStore: Store<RecipesState>;
  public constructor(ingredientsStore: Store<IngredientsState>, recipesStore: Store<RecipesState>) {
    super();
    this.formNames = formNames;
    this.ingredientsStore = ingredientsStore;
    this.recipesStore = recipesStore;
    this.maxMeasureLength = Length.maxMeasureLength;
    this.maxIngredientNameLength = Length.maxIngredientNameLength;
    this.errors = recipeErrors;
    if (PositionsPartComponent.measures.length === 0) {
      this.recipesStore
        .select(selectRecipes)
        .pipe(take(1))
        .subscribe((recipes: Recipe[]) => {
          const measures = recipes
            .flatMap((recipe: Recipe) => recipe.groups)
            .flatMap((group: RecipePositionsGroup) => group.positions)
            .map((position: RecipePosition) => position.measure)
            .filter(
              (measure: string, index: number, self: string[]) =>
                !PositionsPartComponent.measures.includes(measure) &&
                self.indexOf(measure) === index,
            );

          PositionsPartComponent.measures.push(...measures);
        });
    }
  }

  public ngOnInit(): void {
    this.formGroup = this.formPart() as FormGroup;
    this.ingredients = computed(() => {
      const ingredients = this.ingredientsStore.selectSignal(selectIngredients);

      return [...ingredients()].sort((a: Ingredient, b: Ingredient) =>
        StringUtils.compareString(a.name, b.name),
      );
    });

    this.recipes = computed(() => {
      const recipes = this.recipesStore.selectSignal(selectRecipes);

      return [...recipes()].sort((a: Recipe, b: Recipe) =>
        StringUtils.compareString(a.name, b.name),
      );
    });
    const search = this.formPart().get(this.formNames.ingredientSearch) as AbstractControl;
    const search2 = this.formPart().get(this.formNames.measure) as AbstractControl;

    this.onObservableValue(
      (search: string) => {
        const measures = PositionsPartComponent.measures.filter((measure: string) =>
          StringUtils.clearPolishCharacters(measure.toLowerCase()).includes(
            StringUtils.clearPolishCharacters(search.toLowerCase()),
          ),
        );

        if (measures.length === 0 && search.length > 0) {
          measures.push(`Dodać "${search}"?`);
        }
        this.filteredMeasures.set(measures);
      },
      search2.valueChanges,
      '',
    );

    this.measureLength = FormUtils.getLength(
      this.injector,
      this.formGroup,
      this.formNames.measure,
      this.formGroup?.get(this.formNames.measure)?.value ?? '',
    );

    this.onObservableValue(
      (search: string) =>
        this.filteredIngredients.set(
          this.ingredients().filter((ingredient: Ingredient) => {
            const used = this.usedIngredients();
            const index = used.indexOf(this.formPart().get(this.formNames.ingredient)?.value);

            if (index !== -1) {
              used.splice(index, 1);
            }

            return (
              StringUtils.clearPolishCharacters(
                StringUtils.clearPolishCharacters(ingredient.name.toLowerCase()),
              ).includes(StringUtils.clearPolishCharacters(search.toLowerCase())) &&
              !used.includes(ingredient.id)
            );
          }),
        ),
      search.valueChanges,
      '',
    );
    this.onObservableValue(
      (search: string) =>
        this.filteredRecipes.set(
          this.recipes().filter((recipe: Recipe) => {
            const used = this.usedRecipes();
            const index = used.indexOf(this.formPart().get(this.formNames.ingredient)?.value);

            if (index !== -1) {
              used.splice(index, 1);
            }

            return (
              StringUtils.clearPolishCharacters(
                StringUtils.clearPolishCharacters(recipe.name.toLowerCase()),
              ).includes(StringUtils.clearPolishCharacters(search)) && !used.includes(recipe.id)
            );
          }),
        ),
      search.valueChanges,
      '',
    );
  }

  public decreaseAmount(): void {
    const value = this.formPart().get(this.formNames.amount)?.value ?? 0;

    if (value === 0) {
      return;
    }
    this.formPart()
      .get(this.formNames.amount)
      ?.setValue(value - 1);
  }

  public deletePosition(): void {
    this.delete.emit();
  }

  public increaseAmount(): void {
    const value = this.formPart().get(this.formNames.amount)?.value ?? 0;
    this.formPart()
      .get(this.formNames.amount)
      ?.setValue(value + 1);
  }

  public selectIngredient(ingredient: number): void {
    this.formPart().get(this.formNames.ingredient)?.setValue(ingredient);
    this.formPart().get(this.formNames.type)?.setValue('ingredient');
  }

  public selectMeasure(measure: string): void {
    if (measure.startsWith('Dodać "') && measure.endsWith('"?')) {
      measure = measure.slice(7, measure.length - 2);
      PositionsPartComponent.measures.push(measure);
      PositionsPartComponent.measures.sort((a: string, b: string) =>
        StringUtils.compareString(a, b),
      );
    }
    this.formPart().get(this.formNames.measure)?.setValue(measure);
  }

  public selectRecipe(recipe: number): void {
    this.formPart().get(this.formNames.ingredient)?.setValue(recipe);
    this.formPart().get(this.formNames.type)?.setValue('recipe');
  }
}
