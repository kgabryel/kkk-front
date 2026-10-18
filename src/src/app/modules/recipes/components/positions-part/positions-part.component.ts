import type { InputSignal, OnInit, Signal, WritableSignal, OutputEmitterRef } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, computed, input, output, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOptgroup, MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import type { RecipeErrors } from '@/app/core/errors/recipe.error';
import type { RecipesFormNames } from '@/app/core/factories/recipe.factory';
import type { Ingredient } from '@/app/core/models/ingredient';
import type { Recipe, RecipePosition, RecipePositionsGroup } from '@/app/core/models/recipe';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';

import { Length } from '@/app/config/form.config';
import { recipeErrors } from '@/app/core/errors/recipe.error';
import { formNames } from '@/app/core/factories/recipe.factory';
import { selectIngredients } from '@/app/core/store/ingredients/selectors';
import { selectRecipes } from '@/app/core/store/recipes/selectors';
import { FormUtils } from '@/app/core/utils/form.utils';
import { StringUtils } from '@/app/core/utils/string.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';

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
  styleUrl: './positions-part.component.scss',
  templateUrl: './positions-part.component.html',
})
export class PositionsPartComponent extends BaseComponent implements OnInit {
  private static measures: string[] = [];
  public formPart: InputSignal<AbstractControl> = input.required<AbstractControl>();
  public usedIngredients: InputSignal<number[]> = input.required<number[]>();
  public usedRecipes: InputSignal<number[]> = input.required<number[]>();
  public delete: OutputEmitterRef<void> = output<void>();
  public errors: RecipeErrors = recipeErrors;
  public filteredIngredients: WritableSignal<Ingredient[]> = signal<Ingredient[]>([]);
  public filteredMeasures: WritableSignal<string[]> = signal<string[]>([]);
  public filteredRecipes: WritableSignal<Recipe[]> = signal<Recipe[]>([]);
  public formGroup!: FormGroup;
  public formNames: RecipesFormNames = formNames;
  public ingredients!: Signal<Ingredient[]>;
  public maxIngredientNameLength: number = Length.maxIngredientNameLength;
  public maxMeasureLength: number = Length.maxMeasureLength;
  public measureLength!: Signal<number>;
  public recipes!: Signal<Recipe[]>;
  private readonly ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private readonly recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);
  public constructor() {
    super();
    if (PositionsPartComponent.measures.length !== 0) {
      return;
    }

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
              !PositionsPartComponent.measures.includes(measure) && self.indexOf(measure) === index,
          );

        PositionsPartComponent.measures.push(...measures);
      });
  }

  public ngOnInit(): void {
    this.formGroup = this.formPart() as FormGroup;
    this.ingredients = this.ingredientsStore.selectSignal(selectIngredients);

    this.recipes = computed(() => {
      const recipes = this.recipesStore.selectSignal(selectRecipes);

      return [...recipes()].sort((a: Recipe, b: Recipe) => StringUtils.compareString(a.name, b.name));
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
              ).includes(StringUtils.clearPolishCharacters(search.toLowerCase())) && !used.includes(ingredient.id)
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
              StringUtils.clearPolishCharacters(StringUtils.clearPolishCharacters(recipe.name.toLowerCase())).includes(
                StringUtils.clearPolishCharacters(search),
              ) && !used.includes(recipe.id)
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
      PositionsPartComponent.measures.sort((a: string, b: string) => StringUtils.compareString(a, b));
    }
    this.formPart().get(this.formNames.measure)?.setValue(measure);
  }

  public selectRecipe(recipe: number): void {
    this.formPart().get(this.formNames.ingredient)?.setValue(recipe);
    this.formPart().get(this.formNames.type)?.setValue('recipe');
  }
}
