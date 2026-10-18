import { AsyncPipe, CommonModule } from '@angular/common';
import { Injectable, Injector, Signal } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Length } from '../../config/form.config';
import { GroupPositionsPartComponent } from '../../modules/recipes/components/group-positions-part/group-positions-part.component';
import { TagsSelectComponent } from '../../modules/recipes/components/tags-select/tags-select.component';
import { ErrorsContainerComponent } from '../../modules/shared/components/errors-container/errors-container.component';
import { TextEditorComponent } from '../../modules/shared/components/text-editor/text-editor.component';
import { AutocompletePipe } from '../../modules/shared/pipes/autocomplete.pipe';
import { RecipePreviewHrefPipe } from '../../modules/shared/pipes/recipe-preview-href.pipe';
import { FormComponent } from '../../modules/timers/components/form/form.component';
import { recipeErrors, RecipeErrors } from '../errors/recipe.error';
import { formNames, RecipeFormFactory, RecipesFormNames } from '../factories/recipe.factory';
import { Recipe } from '../models/recipe';
import { PositionsGroup, RecipeRequest } from '../requests/recipe.request';
import { TimerRequest } from '../requests/timer.request';
import { State } from '../store/recipes/reducers';
import { FormUtils } from '../utils/form.utils';
import { TimeUtils } from '../utils/time.utils';

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
  public errors: RecipeErrors;
  public form!: FormGroup;
  public formNames: RecipesFormNames;
  public maxRecipeNameLength: number;
  public nameLength!: Signal<number>;
  public positions!: FormArray;
  public positionsGroup!: FormGroup;
  public recipeFormFactory: RecipeFormFactory;
  public recipeModel!: Recipe | null;
  public store: Store<State>;
  public tagsGroup!: FormGroup;
  public timers!: FormArray;
  public injector: Injector;
  public constructor(
    store: Store<State>,
    recipeFormFactory: RecipeFormFactory,
    injector: Injector,
  ) {
    this.store = store;
    this.formNames = formNames;
    this.errors = recipeErrors;
    this.recipeFormFactory = recipeFormFactory;
    this.maxRecipeNameLength = Length.maxRecipeNameLength;
    this.injector = injector;
  }

  public addPositionsGroup(): void {
    this.positions.push(
      RecipeFormFactory.getPositionsGroupPart('', [RecipeFormFactory.getPositionPart()]),
    );
  }

  public addTimer(): void {
    this.timers.push(RecipeFormFactory.getTimerGroupPart(TimeUtils.getZeroTime()));
  }

  public decreasePortion(): void {
    const value =
      this.form.get(this.formNames.detailsGroup)?.get(this.formNames.portions)?.value ?? 1;

    if (value === 1) {
      return;
    }
    this.form
      .get(this.formNames.detailsGroup)
      ?.get(this.formNames.portions)
      ?.setValue(value - 1);
  }

  public increasePortion(): void {
    const value =
      this.form.get(this.formNames.detailsGroup)?.get(this.formNames.portions)?.value ?? 0;
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
    const groupsArray = this.form
      .get(this.formNames.positionsGroup)
      ?.get(this.formNames.positions) as FormArray;
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
      description: this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.description)
        ?.value,
      favourite: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.favourite)?.value,
      groups: groups,
      name: this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.name)?.value,
      portions: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.portions)?.value,
      public: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.public)?.value,
      tags: this.form
        .get(this.formNames.detailsGroup)
        ?.get(this.formNames.tagsGroup)
        ?.get(this.formNames.tags)?.value,
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
    this.tagsGroup = this.form
      .get(this.formNames.detailsGroup)
      ?.get(this.formNames.tagsGroup) as FormGroup;
    this.descriptionGroup = this.form.get(this.formNames.descriptionGroup) as FormGroup;
    this.detailsGroup = this.form.get(this.formNames.detailsGroup) as FormGroup;
    this.positionsGroup = this.form.get(this.formNames.positionsGroup) as FormGroup;
    this.positions = this.form
      .get(this.formNames.positionsGroup)
      ?.get(this.formNames.positions) as FormArray;
    this.timers = this.form
      .get(this.formNames.detailsGroup)
      ?.get(this.formNames.timersGroup) as FormArray;
    this.nameLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.descriptionGroup,
      this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.name)?.value ?? '',
    );
  }
}
