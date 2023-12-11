import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {formNames, RecipeFormFactory, RecipesFormNames} from '../../../../core/factories/recipe.factory';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {recipeErrors, RecipeErrors} from '../../../../core/errors/recipe.error';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {editorConfig} from '../../../../config/text-editor.config';
import {PositionsGroup, RecipeRequest} from '../../../../core/requests/recipe.request';
import {Recipe} from '../../../../core/models/recipe';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {TimeUtils} from '../../../../core/utils/time.utils';
import {TimerRequest} from '../../../../core/requests/timer.request';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'recipes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {

  @Input() public add: boolean = false;
  public positions: FormArray;
  public timers: FormArray;
  public formNames: RecipesFormNames;
  public errors: RecipeErrors;
  public editorConfig: AngularEditorConfig;
  public form: FormGroup;
  public tagsGroup: FormGroup;
  public descriptionGroup: FormGroup;
  public detailsGroup: FormGroup;
  public positionsGroup: FormGroup;
  public nameLength$: Observable<number>;
  public recipeModel: Recipe | null;
  public maxRecipeNameLength: number;
  protected store: Store<State>;
  protected recipeFormFactory: RecipeFormFactory;

  public constructor(store: Store<State>, recipeFormFactory: RecipeFormFactory) {
    this.store = store;
    this.formNames = formNames;
    this.errors = recipeErrors;
    this.editorConfig = editorConfig;
    this.recipeFormFactory = recipeFormFactory;
    this.maxRecipeNameLength = Length.maxRecipeNameLength;
  }

  public addPositionsGroup(): void {
    this.positions.push(RecipeFormFactory.getPositionsGroupPart('', [
      RecipeFormFactory.getPositionPart()
    ]));
  }

  public addTimer(): void {
    this.timers.push(RecipeFormFactory.getTimerGroupPart(TimeUtils.getZeroTime()));
  }

  public removeGroup(index: number): void {
    this.positions.removeAt(index);
  }

  public removeTimer(index: number): void {
    this.timers.removeAt(index);
  }

  public markDescriptionsAsTouched(): void {
    this.descriptionGroup.markAllAsTouched();
  }

  public markDetailsAsTouched(): void {
    this.detailsGroup.markAllAsTouched();
  }

  public submit(): void {
  }

  protected setUp(): void {
    this.tagsGroup = this.form.get(this.formNames.detailsGroup)?.get(this.formNames.tagsGroup) as FormGroup;
    this.descriptionGroup = this.form.get(this.formNames.descriptionGroup) as FormGroup;
    this.detailsGroup = this.form.get(this.formNames.detailsGroup) as FormGroup;
    this.positionsGroup = this.form.get(this.formNames.positionsGroup) as FormGroup;
    this.positions = this.form.get(this.formNames.positionsGroup)?.get(this.formNames.positions) as FormArray;
    this.timers = this.form.get(this.formNames.detailsGroup)?.get(this.formNames.timersGroup) as FormArray;
    this.nameLength$ = (this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.name) as FormControl)
      .valueChanges.pipe(
        startWith(this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.name)?.value ?? ''),
        map(value => value.length)
      );
  }

  protected prepareRequest(): RecipeRequest {
    let groups: PositionsGroup[] = [];
    const groupsArray = this.form.get(this.formNames.positionsGroup)?.get(this.formNames.positions) as FormArray;
    groupsArray.controls.forEach((element: AbstractControl) => {
      let group: PositionsGroup = {
        name: element.get(this.formNames.name)?.value ?? '',
        positions: []
      };
      const positions = element.get(this.formNames.positions) as FormArray;
      positions.controls.forEach(position => {
        if (position.get(this.formNames.measure)?.value === '' || position.get(this.formNames.measure)?.value === null) {
          return;
        }
        if (position.get(this.formNames.ingredient)?.value === 0 || position.get(this.formNames.ingredient)?.value === null) {
          return;
        }
        group.positions.push({
          amount: position.get(this.formNames.amount)?.value,
          measure: position.get(this.formNames.measure)?.value,
          additional: position.get(this.formNames.additional)?.value,
          ingredient: position.get(this.formNames.type)?.value === 'ingredient' ? position.get(this.formNames.ingredient)?.value : null,
          recipe: position.get(this.formNames.type)?.value === 'recipe' ? position.get(this.formNames.ingredient)?.value : null
        });
      });
      groups.push(group);
    });
    let timers: TimerRequest[] = [];
    this.timers.controls.forEach(timer => {
      timers.push({
        name: timer.get(this.formNames.name)?.value,
        time: TimeUtils.dateToTime(timer.get(this.formNames.time)?.value)
      });
    });
    groups = groups.filter(group => group.positions.length > 0);
    return {
      name: this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.name)?.value,
      description: this.form.get(this.formNames.descriptionGroup)?.get(this.formNames.description)?.value,
      url: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.url)?.value,
      portions: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.portions)?.value,
      favourite: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.favourite)?.value,
      public: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.public)?.value,
      toDo: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.toDo)?.value,
      tags: this.form.get(this.formNames.detailsGroup)?.get(this.formNames.tagsGroup)?.get(this.formNames.tags)?.value,
      groups: groups,
      timers: timers
    };
  }
}
