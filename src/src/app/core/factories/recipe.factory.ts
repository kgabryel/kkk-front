import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Length } from '../../config/form.config';
import { Ingredient } from '../models/ingredient';
import { Recipe, RecipePosition, RecipePositionsGroup } from '../models/recipe';
import { Tag } from '../models/tag';
import { Time } from '../models/time';
import { Timer } from '../models/timer';
import { State as IngredientState } from '../store/ingredients/reducers';
import { selectById as selectIngredientById } from '../store/ingredients/selectors';
import { State as RecipeState } from '../store/recipes/reducers';
import { selectById as selectRecipeById } from '../store/recipes/selectors';
import { State as TagState } from '../store/tags/reducers';
import { selectTagsForRecipe } from '../store/tags/selectors';
import { TimeUtils } from '../utils/time.utils';
import { TimeValidator } from '../validators/time.validator';
import { UrlValidator } from '../validators/url.validator';

export interface RecipesFormNames {
  name: string;
  description: string;
  url: string;
  portions: string;
  favourite: string;
  public: string;
  toDo: string;
  tagsGroup: string;
  tags: string;
  search: string;
  positions: string;
  amount: string;
  measure: string;
  ingredient: string;
  additional: string;
  ingredientSearch: string;
  descriptionGroup: string;
  detailsGroup: string;
  positionsGroup: string;
  type: string;
  timersGroup: string;
  time: string;
}

export const formNames: RecipesFormNames = {
  additional: 'additional',
  amount: 'amount',
  description: 'description',
  descriptionGroup: 'descriptionGroup',
  detailsGroup: 'detailsGroup',
  favourite: 'favourite',
  ingredient: 'ingredient',
  ingredientSearch: 'ingredientSearch',
  measure: 'measure',
  name: 'name',
  portions: 'portions',
  positions: 'positions',
  positionsGroup: 'positionsGroup',
  public: 'public',
  search: 'search',
  tags: 'tags',
  tagsGroup: 'tagsGroup',
  time: 'time',
  timersGroup: 'timersGroup',
  toDo: 'toDo',
  type: 'type',
  url: 'url',
};

@Injectable()
export class RecipeFormFactory {
  private readonly ingredientsStore: Store<IngredientState>;
  private readonly recipesStore: Store<RecipeState>;
  private readonly tagsStore: Store<TagState>;
  public constructor(
    recipesStore: Store<RecipeState>,
    tagsStore: Store<TagState>,
    ingredientsStore: Store<IngredientState>,
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
    ingredientName: string = '',
  ): FormGroup {
    return new FormGroup({
      [formNames.additional]: new FormControl(additional, [Validators.required]),
      [formNames.amount]: new FormControl(amount, [Validators.min(0)]),
      [formNames.ingredient]: new FormControl(ingredient ?? recipe ?? 0, [Validators.required]),
      [formNames.ingredientSearch]: new FormControl(ingredientName, [
        Validators.required,
        Validators.minLength(1),
      ]),
      [formNames.measure]: new FormControl(measure, [
        Validators.required,
        Validators.maxLength(Length.maxMeasureLength),
      ]),
      [formNames.type]: new FormControl(recipe === null ? 'ingredient' : 'recipe'),
    });
  }

  public static getPositionsGroupPart(name: string = '', positions: FormGroup[] = []): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(name, [
        Validators.maxLength(Length.maxIngredientsGroupNameLength),
      ]),
      [formNames.positions]: new FormArray(positions),
    });
  }

  public static getTimerGroupPart(time: Time, name: string | null = ''): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(name, [Validators.maxLength(Length.maxTimerNameLength)]),
      [formNames.time]: new FormControl(time, [
        Validators.required,
        TimeValidator.greaterThanZero(),
      ]),
    });
  }

  public getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.descriptionGroup]: new FormGroup({
        [formNames.description]: new FormControl(''),
        [formNames.name]: new FormControl('', [
          Validators.required,
          Validators.maxLength(Length.maxRecipeNameLength),
        ]),
      }),
      [formNames.detailsGroup]: new FormGroup({
        [formNames.favourite]: new FormControl(false, [Validators.required]),
        [formNames.portions]: new FormControl(1, [Validators.required, Validators.min(1)]),
        [formNames.public]: new FormControl(false, [Validators.required]),
        [formNames.tagsGroup]: new FormGroup({
          [formNames.search]: new FormControl(),
          [formNames.tags]: new FormArray([]),
        }),
        [formNames.timersGroup]: new FormArray([]),
        [formNames.toDo]: new FormControl(false, [Validators.required]),
        [formNames.url]: new FormControl('', [UrlValidator.url()]),
      }),
      [formNames.positionsGroup]: new FormGroup({
        [formNames.positions]: new FormArray([
          RecipeFormFactory.getPositionsGroupPart('', [RecipeFormFactory.getPositionPart()]),
        ]),
      }),
    });
  }

  public getEditForm(recipe: Recipe): FormGroup {
    const formGroup = new FormGroup({
      [formNames.descriptionGroup]: new FormGroup({
        [formNames.description]: new FormControl(recipe.description),
        [formNames.name]: new FormControl(recipe.name, [
          Validators.required,
          Validators.maxLength(Length.maxRecipeNameLength),
        ]),
      }),
      [formNames.detailsGroup]: new FormGroup({
        [formNames.favourite]: new FormControl(recipe.favourite, [Validators.required]),
        [formNames.portions]: new FormControl(recipe.portions, [
          Validators.required,
          Validators.min(1),
        ]),
        [formNames.public]: new FormControl(recipe.public, [Validators.required]),
        [formNames.tagsGroup]: new FormGroup({
          [formNames.search]: new FormControl(),
          [formNames.tags]: new FormArray([]),
        }),
        [formNames.timersGroup]: new FormArray([]),
        [formNames.toDo]: new FormControl(recipe.toDo, [Validators.required]),
        [formNames.url]: new FormControl(recipe.url, [UrlValidator.url()]),
      }),
      [formNames.positionsGroup]: new FormGroup({
        [formNames.positions]: new FormArray([]),
      }),
    });

    this.tagsStore
      .select(selectTagsForRecipe(recipe))
      .subscribe((tags: Tag[]) => {
        const tagsInput = formGroup
          .get(formNames.detailsGroup)
          ?.get(formNames.tagsGroup)
          ?.get(formNames.tags) as FormArray;
        tags.forEach((tag: Tag) => tagsInput.push(new FormControl(tag.name)));
      })
      .unsubscribe();
    const positionsGroup = formGroup
      .get(formNames.positionsGroup)
      ?.get(formNames.positions) as FormArray;
    const timersGroup = formGroup
      .get(formNames.detailsGroup)
      ?.get(formNames.timersGroup) as FormArray;
    recipe.groups.forEach((group: RecipePositionsGroup) => {
      const groupControl = RecipeFormFactory.getPositionsGroupPart(group.name);
      const positions = groupControl.get(formNames.positions) as FormArray;
      group.positions.forEach((position: RecipePosition) => {
        if (position.ingredient !== null) {
          this.ingredientsStore
            .select(selectIngredientById(position.ingredient))
            .subscribe((ingredient: Ingredient | undefined) => {
              positions.push(
                RecipeFormFactory.getPositionPart(
                  position.amount,
                  position.measure,
                  position.ingredient,
                  position.recipe,
                  position.additional,
                  ingredient?.name,
                ),
              );
            })
            .unsubscribe();
        }
        if (position.recipe !== null) {
          this.recipesStore
            .select(selectRecipeById(position.recipe))
            .subscribe((recipe: Recipe | undefined) =>
              positions.push(
                RecipeFormFactory.getPositionPart(
                  position.amount,
                  position.measure,
                  position.ingredient,
                  position.recipe,
                  position.additional,
                  recipe?.name,
                ),
              ),
            )
            .unsubscribe();
        }
      });
      positionsGroup.push(groupControl);
    });
    recipe.timers.forEach((timer: Timer) =>
      timersGroup.push(
        RecipeFormFactory.getTimerGroupPart(TimeUtils.timeToDate(timer.time), timer.name),
      ),
    );

    return formGroup;
  }
}
