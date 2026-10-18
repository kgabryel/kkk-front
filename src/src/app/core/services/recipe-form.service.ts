import type { Signal } from '@angular/core';
import type { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { AsyncPipe, CommonModule } from '@angular/common';
import { Injectable, Injector, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import type { RecipeErrors } from '@/app/core/errors/recipe.error';
import type { RecipesFormNames } from '@/app/core/factories/recipe.factory';
import type { Recipe } from '@/app/core/models/recipe';
import type { PositionsGroup, RecipeRequest } from '@/app/core/requests/recipe.request';
import type { TimerRequest } from '@/app/core/requests/timer.request';
import type { State } from '@/app/core/store/recipes/reducers';

import { Length } from '@/app/config/form.config';
import { recipeErrors } from '@/app/core/errors/recipe.error';
import { formNames, RecipeFormFactory } from '@/app/core/factories/recipe.factory';
import { FormUtils } from '@/app/core/utils/form.utils';
import { TimeUtils } from '@/app/core/utils/time.utils';
import { GroupPositionsPartComponent } from '@/app/modules/recipes/components/group-positions-part/group-positions-part.component';
import { TagsSelectComponent } from '@/app/modules/recipes/components/tags-select/tags-select.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';
import { TextEditorComponent } from '@/app/modules/shared/components/text-editor/text-editor.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';
import { RecipePreviewHrefPipe } from '@/app/modules/shared/pipes/recipe-preview-href.pipe';
import { FormComponent } from '@/app/modules/timers/components/form/form.component';

export const imports = [
  ReactiveFormsModule,
  CommonModule,
  AsyncPipe,
  MatStepper,
  MatStep,
  MatStepLabel,
  MatFormField,
  MatLabel,
  MatHint,
  MatInput,
  MatSlideToggle,
  MatIcon,
  MatButton,
  RouterLink,
  ErrorsContainerComponent,
  TagsSelectComponent,
  GroupPositionsPartComponent,
  FormComponent,
  RecipePreviewHrefPipe,
  TextEditorComponent,
  AutocompletePipe,
];

export const providers = [RecipeFormFactory];

@Injectable()
export class RecipeFormService {
  public descriptionGroup!: FormGroup;
  public detailsGroup!: FormGroup;
  public errors: RecipeErrors = recipeErrors;
  public form!: FormGroup;
  public formNames: RecipesFormNames = formNames;
  public maxRecipeNameLength: number = Length.maxRecipeNameLength;
  public nameLength!: Signal<number>;
  public positions!: FormArray;
  public positionsGroup!: FormGroup;
  public recipeFormFactory: RecipeFormFactory = inject(RecipeFormFactory);
  public recipeModel!: Recipe | null;
  public store: Store<State> = inject<Store<State>>(Store);
  public tagsGroup!: FormGroup;
  public timers!: FormArray;
  public injector: Injector = inject(Injector);

  public addPositionsGroup(): void {
    this.positions.push(RecipeFormFactory.getPositionsGroupPart('', [RecipeFormFactory.getPositionPart()]));
  }

  public addTimer(): void {
    this.timers.push(RecipeFormFactory.getTimerGroupPart(TimeUtils.getZeroTime()));
  }

  public decreasePortion(): void {
    const value = this.form.get(this.formNames.detailsGroup)?.get(this.formNames.portions)?.value ?? 1;

    if (value === 1) {
      return;
    }
    this.form
      .get(this.formNames.detailsGroup)
      ?.get(this.formNames.portions)
      ?.setValue(value - 1);
  }

  public increasePortion(): void {
    const value = this.form.get(this.formNames.detailsGroup)?.get(this.formNames.portions)?.value ?? 0;
    this.form
      .get(this.formNames.detailsGroup)
      ?.get(this.formNames.portions)
      ?.setValue(value + 1);
  }

  public markDescriptionsAsTouched(): void {
    this.descriptionGroup.markAllAsTouched();
  }

  public markDetailsAsTouched(): void {
    this.detailsGroup.markAllAsTouched();
  }

  public prepareRequest(): RecipeRequest {
    let groups: PositionsGroup[] = [];
    const groupsArray = this.form.get(this.formNames.positionsGroup)?.get(this.formNames.positions) as FormArray;
    groupsArray.controls.forEach((element: AbstractControl) => {
      const group: PositionsGroup = {
        name: element.get(this.formNames.name)?.value ?? '',
        positions: [],
      };
      const positions = element.get(this.formNames.positions) as FormArray;
      positions.controls.forEach((position: AbstractControl) => {
        if (
          position.get(this.formNames.measure)?.value === '' ||
          position.get(this.formNames.measure)?.value === null
        ) {
          return;
        }
        if (
          position.get(this.formNames.ingredient)?.value === 0 ||
          position.get(this.formNames.ingredient)?.value === null
        ) {
          return;
        }
        const type = position.get(this.formNames.type)?.value;
        group.positions.push({
          additional: position.get(this.formNames.additional)?.value,
          amount: position.get(this.formNames.amount)?.value,
          ingredient: type === 'ingredient' ? position.get(this.formNames.ingredient)?.value : null,
          measure: position.get(this.formNames.measure)?.value,
          recipe: type === 'recipe' ? position.get(this.formNames.ingredient)?.value : null,
        });
      });
      groups.push(group);
    });
    const timers: TimerRequest[] = [];
    this.timers.controls.forEach((timer: AbstractControl) => {
      timers.push({
        name: timer.get(this.formNames.name)?.value,
        time: TimeUtils.dateToTime(timer.get(this.formNames.time)?.value),
      });
    });
    groups = groups.filter((group: PositionsGroup) => group.positions.length > 0);

    return {
      description: this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.description)?.value,
      favourite: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.favourite)?.value,
      groups: groups,
      name: this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.name)?.value,
      portions: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.portions)?.value,
      public: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.public)?.value,
      tags: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.tagsGroup)?.get(this.formNames.tags)?.value,
      timers: timers,
      toDo: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.toDo)?.value,
      url: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.url)?.value,
    };
  }

  public removeGroup(index: number): void {
    this.positions.removeAt(index);
  }

  public removeTimer(index: number): void {
    this.timers.removeAt(index);
  }

  public setUp(): void {
    this.tagsGroup = this.form.get(this.formNames.detailsGroup)?.get(this.formNames.tagsGroup) as FormGroup;
    this.descriptionGroup = this.form.get(this.formNames.descriptionGroup) as FormGroup;
    this.detailsGroup = this.form.get(this.formNames.detailsGroup) as FormGroup;
    this.positionsGroup = this.form.get(this.formNames.positionsGroup) as FormGroup;
    this.positions = this.form.get(this.formNames.positionsGroup)?.get(this.formNames.positions) as FormArray;
    this.timers = this.form.get(this.formNames.detailsGroup)?.get(this.formNames.timersGroup) as FormArray;
    this.nameLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.descriptionGroup,
      this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.name)?.value ?? '',
    );
  }
}
