import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map } from 'rxjs/operators';

import { Length } from '../../../../config/form.config';
import { RecipeErrors, recipeErrors } from '../../../../core/errors/recipe.error';
import {
  formNames,
  RecipeFormFactory,
  RecipesFormNames,
} from '../../../../core/factories/recipe.factory';
import { FormUtils } from '../../../../core/utils/form.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';
import { PositionsPartComponent } from '../positions-part/positions-part.component';

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
  standalone: true,
  styleUrls: ['./group-positions-part.component.scss'],
  templateUrl: './group-positions-part.component.html',
})
export class GroupPositionsPartComponent extends BaseComponent implements OnInit {
  public formPart: InputSignal<AbstractControl> = input.required<AbstractControl>();
  public delete = output<void>();
  public errors: RecipeErrors;
  public formGroup!: FormGroup;
  public formNames: RecipesFormNames;
  public maxNameLength: number;
  public nameLength!: Signal<number>;
  public positions!: FormArray;
  public usedIngredients: WritableSignal<number[]> = signal<number[]>([]);
  public usedRecipes!: number[];
  public constructor() {
    super();
    this.formNames = formNames;
    this.errors = recipeErrors;
    this.maxNameLength = Length.maxIngredientsGroupNameLength;
  }

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
        .filter((position: any) => position.type === 'ingredient')
        .map((position: any) => position.ingredient),
    );

    this.usedRecipes = this.positions.value
      .filter((position: any) => position.type === 'recipe')
      .map((position: any) => position.ingredient);

    this.onObservableValue(
      (data) => this.usedIngredients.set(data),
      this.positions.valueChanges.pipe(
        map((positions: any) => positions.map((position: any) => position.ingredient)),
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
