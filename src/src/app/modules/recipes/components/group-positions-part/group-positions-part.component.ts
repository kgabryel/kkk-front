import type { InputSignal, OnInit, Signal, WritableSignal, OutputEmitterRef } from '@angular/core';
import type { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map } from 'rxjs/operators';

import type { RecipeErrors } from '@/app/core/errors/recipe.error';
import type { PositionFormValue, RecipesFormNames } from '@/app/core/factories/recipe.factory';

import { Length } from '@/app/config/form.config';
import { recipeErrors } from '@/app/core/errors/recipe.error';
import { formNames, RecipeFormFactory } from '@/app/core/factories/recipe.factory';
import { FormUtils } from '@/app/core/utils/form.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { PositionsPartComponent } from '@/app/modules/recipes/components/positions-part/positions-part.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatIcon,
    MatInput,
    MatButton,
    ErrorsContainerComponent,
    PositionsPartComponent,
  ],
  selector: 'recipes-group-positions-part',
  styleUrl: './group-positions-part.component.scss',
  templateUrl: './group-positions-part.component.html',
})
export class GroupPositionsPartComponent extends BaseComponent implements OnInit {
  public formPart: InputSignal<AbstractControl> = input.required<AbstractControl>();
  public delete: OutputEmitterRef<void> = output<void>();
  public errors: RecipeErrors = recipeErrors;
  public formGroup!: FormGroup;
  public formNames: RecipesFormNames = formNames;
  public maxNameLength: number = Length.maxIngredientsGroupNameLength;
  public nameLength!: Signal<number>;
  public positions!: FormArray;
  public usedIngredients: WritableSignal<number[]> = signal<number[]>([]);
  public usedRecipes!: number[];

  public ngOnInit(): void {
    this.formGroup = this.formPart() as FormGroup;
    this.nameLength = FormUtils.getLength(
      this.injector,
      this.formGroup,
      this.formNames.name,
      this.formGroup?.get(this.formNames.name)?.value ?? '',
    );
    this.positions = this.formGroup.get(this.formNames.positions) as FormArray;

    this.usedIngredients.set(
      this.positions.value
        .filter((position: PositionFormValue) => position.type === 'ingredient')
        .map((position: PositionFormValue) => position.ingredient),
    );

    this.usedRecipes = this.positions.value
      .filter((position: PositionFormValue) => position.type === 'recipe')
      .map((position: PositionFormValue) => position.ingredient);

    this.onObservableValue(
      (data: number[]) => this.usedIngredients.set(data),
      this.positions.valueChanges.pipe(
        map((positions: PositionFormValue[]) => positions.map((position: PositionFormValue) => position.ingredient)),
      ),
      [],
    );
  }

  public addPosition(): void {
    this.positions.push(RecipeFormFactory.getPositionPart());
  }

  public deleteGroup(): void {
    this.delete.emit();
  }

  public removePosition(index: number): void {
    this.positions.removeAt(index);
  }
}
