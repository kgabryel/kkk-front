import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Injectable} from '@angular/core';
import {State as RecipeState} from '../store/recipes/reducers';
import {State as TagState} from '../store/tags/reducers';
import {State as IngredientState} from '../store/ingredients/reducers';
import {Store} from '@ngrx/store';
import {CustomValidators} from 'ng2-validation';
import {Recipe} from '../models/recipe';
import {selectTagsForRecipe} from '../store/tags/selectors';
import {selectById as selectIngredientById} from '../store/ingredients/selectors';
import {selectById as selectRecipeById} from '../store/recipes/selectors';
import {Length} from '../../config/form.config';
import {TimeValidator} from '../validators/time.validator';
import {TimeUtils} from '../utils/time.utils';

export interface RecipesFormNames {
  name: string,
  description: string,
  url: string,
  portions: string,
  favourite: string,
  public: string,
  toDo: string,
  tagsGroup: string,
  tags: string,
  search: string,
  positions: string,
  amount: string,
  measure: string,
  ingredient: string,
  additional: string,
  ingredientSearch: string,
  descriptionGroup: string,
  detailsGroup: string,
  positionsGroup: string,
  type: string,
  timersGroup: string,
  time: string
}

export const formNames: RecipesFormNames = {
  name: 'name',
  description: 'description',
  url: 'url',
  portions: 'portions',
  favourite: 'favourite',
  public: 'public',
  toDo: 'toDo',
  tagsGroup: 'tagsGroup',
  tags: 'tags',
  search: 'search',
  positions: 'positions',
  amount: 'amount',
  measure: 'measure',
  ingredient: 'ingredient',
  additional: 'additional',
  ingredientSearch: 'ingredientSearch',
  descriptionGroup: 'descriptionGroup',
  detailsGroup: 'detailsGroup',
  positionsGroup: 'positionsGroup',
  type: 'type',
  timersGroup: 'timersGroup',
  time: 'time'
};

@Injectable()
export class RecipeFormFactory {
  private readonly recipesStore: Store<RecipeState>;
  private readonly tagsStore: Store<TagState>;
  private readonly ingredientsStore: Store<IngredientState>;

  public constructor(
    recipesStore: Store<RecipeState>,
    tagsStore: Store<TagState>,
    ingredientsStore: Store<IngredientState>
  ) {
    this.recipesStore = recipesStore;
    this.tagsStore = tagsStore;
    this.ingredientsStore = ingredientsStore;
  }

  public static getPositionPart(
    amount: number | null = null,
    measure: string = '',
    ingredient: number | null = null,
    recipe: number | null = null,
    additional: boolean = false,
    ingredientName: string = ''
  ): FormGroup {
    return new FormGroup({
      [formNames.amount]: new FormControl(amount, [Validators.min(0)]),
      [formNames.ingredient]: new FormControl(ingredient ?? recipe ?? 0, [Validators.required]),
      [formNames.additional]: new FormControl(additional, [Validators.required]),
      [formNames.type]: new FormControl(recipe === null ? 'ingredient' : 'recipe'),
      [formNames.ingredientSearch]: new FormControl(ingredientName, [
        Validators.required, Validators.minLength(1)
      ]),
      [formNames.measure]: new FormControl(measure, [
        Validators.required,
        Validators.maxLength(Length.maxMeasureLength)])
    });
  }

  public static getPositionsGroupPart(name: string = '', positions: FormGroup[] = []): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(name, [
        Validators.maxLength(Length.maxIngredientsGroupNameLength)
      ]),
      [formNames.positions]: new FormArray(positions)
    });
  }

  public static getTimerGroupPart(time: Date, name: string | null = ''): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [Validators.maxLength(Length.maxTimerNameLength)]),
      [formNames.time]: new FormControl(time, [Validators.required, TimeValidator.greaterThanZero()])
    });
  }

  public getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.descriptionGroup]: new FormGroup({
        [formNames.name]: new FormControl('', [
          Validators.required, Validators.maxLength(Length.maxRecipeNameLength)
        ]),
        [formNames.description]: new FormControl('')
      }),
      [formNames.detailsGroup]: new FormGroup({
        [formNames.url]: new FormControl('', [CustomValidators.url]),
        [formNames.favourite]: new FormControl(false, [Validators.required]),
        [formNames.public]: new FormControl(false, [Validators.required]),
        [formNames.toDo]: new FormControl(false, [Validators.required]),
        [formNames.portions]: new FormControl(1, [Validators.required, Validators.min(1)]),
        [formNames.tagsGroup]: new FormGroup({
          [formNames.tags]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.timersGroup]: new FormArray([])
      }),
      [formNames.positionsGroup]: new FormGroup({
        [formNames.positions]: new FormArray([
          RecipeFormFactory.getPositionsGroupPart('', [RecipeFormFactory.getPositionPart()])
        ])
      })
    });
  }

  public getEditForm(recipe: Recipe): FormGroup {
    let formGroup = new FormGroup({
      [formNames.descriptionGroup]: new FormGroup({
        [formNames.name]: new FormControl(recipe.name, [
          Validators.required,
          Validators.maxLength(Length.maxRecipeNameLength)]),
        [formNames.description]: new FormControl(recipe.description)
      }),
      [formNames.detailsGroup]: new FormGroup({
        [formNames.url]: new FormControl(recipe.url, [CustomValidators.url]),
        [formNames.favourite]: new FormControl(recipe.favourite, [Validators.required]),
        [formNames.public]: new FormControl(recipe.public, [Validators.required]),
        [formNames.toDo]: new FormControl(recipe.toDo, [Validators.required]),
        [formNames.portions]: new FormControl(recipe.portions, [Validators.required, Validators.min(1)]),
        [formNames.tagsGroup]: new FormGroup({
          [formNames.tags]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.timersGroup]: new FormArray([])
      }),
      [formNames.positionsGroup]: new FormGroup({
        [formNames.positions]: new FormArray([])
      })
    });

    this.tagsStore.select(selectTagsForRecipe(recipe)).subscribe(tags => {
      let tagsInput = formGroup.get(formNames.detailsGroup)?.get(formNames.tagsGroup)?.get(formNames.tags) as FormArray;
      tags.forEach(tag => tagsInput.push(new FormControl(tag.name)));
    }).unsubscribe();
    let positionsGroup = formGroup.get(formNames.positionsGroup)?.get(formNames.positions) as FormArray;
    let timersGroup = formGroup.get(formNames.detailsGroup)?.get(formNames.timersGroup) as FormArray;
    recipe.groups.forEach(group => {
      let groupControl = RecipeFormFactory.getPositionsGroupPart(group.name);
      let positions = groupControl.get(formNames.positions) as FormArray;
      group.positions.forEach(position => {
        if (position.ingredient !== null) {
          this.ingredientsStore.select(selectIngredientById(position.ingredient)).subscribe((ingredient: any) => {
            positions.push(
              RecipeFormFactory.getPositionPart(
                position.amount,
                position.measure,
                position.ingredient,
                position.recipe,
                position.additional,
                ingredient?.name
              )
            );
          }).unsubscribe();
        }
        if (position.recipe !== null) {
          this.recipesStore.select(selectRecipeById(position.recipe)).subscribe((recipe: any) => positions.push(
              RecipeFormFactory.getPositionPart(
                position.amount,
                position.measure,
                position.ingredient,
                position.recipe,
                position.additional,
                recipe?.name
              )
            )
          ).unsubscribe();
        }
      });
      positionsGroup.push(groupControl);
    });
    recipe.timers.forEach(timer => timersGroup.push(
      RecipeFormFactory.getTimerGroupPart(TimeUtils.timeToDate(timer.time), timer.name)
    ));
    return formGroup;
  }
}
