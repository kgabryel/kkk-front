import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import type { Recipe, RecipePosition, RecipePositionsGroup } from '@/app/core/models/recipe';
import type { Tag } from '@/app/core/models/tag';
import type { Time } from '@/app/core/models/time';
import type { Timer } from '@/app/core/models/timer';
import type { State as IngredientState } from '@/app/core/store/ingredients/reducers';
import type { State as RecipeState } from '@/app/core/store/recipes/reducers';
import type { State as TagState } from '@/app/core/store/tags/reducers';

import { Length } from '@/app/config/form.config';
import { selectById as selectIngredientById } from '@/app/core/store/ingredients/selectors';
import { selectById as selectRecipeById } from '@/app/core/store/recipes/selectors';
import { selectTagsForRecipe } from '@/app/core/store/tags/selectors';
import { TimeUtils } from '@/app/core/utils/time.utils';
import { TimeValidator } from '@/app/core/validators/time.validator';
import { UrlValidator } from '@/app/core/validators/url.validator';

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

export interface PositionFormValue {
  additional: boolean;
  amount: number | null;
  ingredient: number;
  ingredientSearch: string;
  measure: string;
  type: 'ingredient' | 'recipe';
}

@Injectable()
export class RecipeFormFactory {
  private readonly ingredientsStore: Store<IngredientState> = inject<Store<IngredientState>>(Store);
  private readonly recipesStore: Store<RecipeState> = inject<Store<RecipeState>>(Store);
  private readonly tagsStore: Store<TagState> = inject<Store<TagState>>(Store);

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
      [formNames.ingredientSearch]: new FormControl(ingredientName, [Validators.required, Validators.minLength(1)]),
      [formNames.measure]: new FormControl(measure, [
        Validators.required,
        Validators.maxLength(Length.maxMeasureLength),
      ]),
      [formNames.type]: new FormControl(recipe === null ? 'ingredient' : 'recipe'),
    });
  }

  public static getPositionsGroupPart(name: string = '', positions: FormGroup[] = []): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(name, [Validators.maxLength(Length.maxIngredientsGroupNameLength)]),
      [formNames.positions]: new FormArray(positions),
    });
  }

  public static getTimerGroupPart(time: Time, name: string | null = ''): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(name, [Validators.maxLength(Length.maxTimerNameLength)]),
      [formNames.time]: new FormControl(time, [Validators.required, TimeValidator.greaterThanZero()]),
    });
  }

  private static buildForm(recipe?: Recipe): FormGroup {
    return new FormGroup({
      [formNames.descriptionGroup]: new FormGroup({
        [formNames.description]: new FormControl(recipe?.description ?? ''),
        [formNames.name]: new FormControl(recipe?.name ?? '', [
          Validators.required,
          Validators.maxLength(Length.maxRecipeNameLength),
        ]),
      }),
      [formNames.detailsGroup]: new FormGroup({
        [formNames.favourite]: new FormControl(recipe?.favourite ?? false, [Validators.required]),
        [formNames.portions]: new FormControl(recipe?.portions ?? 1, [Validators.required, Validators.min(1)]),
        [formNames.public]: new FormControl(recipe?.public ?? false, [Validators.required]),
        [formNames.tagsGroup]: new FormGroup({
          [formNames.search]: new FormControl(),
          [formNames.tags]: new FormArray([]),
        }),
        [formNames.timersGroup]: new FormArray([]),
        [formNames.toDo]: new FormControl(recipe?.toDo ?? false, [Validators.required]),
        [formNames.url]: new FormControl(recipe?.url ?? '', [UrlValidator.url()]),
      }),
      [formNames.positionsGroup]: new FormGroup({
        [formNames.positions]: new FormArray([]),
      }),
    });
  }

  public getCreateForm(): FormGroup {
    const form = RecipeFormFactory.buildForm();
    const groups = form.get([formNames.positionsGroup, formNames.positions]) as FormArray;
    groups.push(RecipeFormFactory.getPositionsGroupPart('', [RecipeFormFactory.getPositionPart()]));

    return form;
  }

  public getEditForm(recipe: Recipe): FormGroup {
    const form = RecipeFormFactory.buildForm(recipe);
    const tags = form.get([formNames.detailsGroup, formNames.tagsGroup, formNames.tags]) as FormArray;
    const timers = form.get([formNames.detailsGroup, formNames.timersGroup]) as FormArray;
    const groups = form.get([formNames.positionsGroup, formNames.positions]) as FormArray;

    this.tagsStore
      .selectSignal(selectTagsForRecipe(recipe))()
      .forEach((tag: Tag) => tags.push(new FormControl(tag.name)));
    recipe.groups.forEach((group: RecipePositionsGroup) =>
      groups.push(
        RecipeFormFactory.getPositionsGroupPart(
          group.name,
          group.positions.map((position: RecipePosition) => this.getPositionControl(position)),
        ),
      ),
    );
    recipe.timers.forEach((timer: Timer) =>
      timers.push(RecipeFormFactory.getTimerGroupPart(TimeUtils.timeToDate(timer.time), timer.name)),
    );

    return form;
  }

  private getPositionControl(position: RecipePosition): FormGroup {
    return RecipeFormFactory.getPositionPart(
      position.amount,
      position.measure,
      position.ingredient,
      position.recipe,
      position.additional,
      this.getPositionName(position),
    );
  }

  private getPositionName(position: RecipePosition): string | undefined {
    if (position.ingredient !== null) {
      return this.ingredientsStore.selectSignal(selectIngredientById(position.ingredient))()?.name;
    }
    if (position.recipe !== null) {
      return this.recipesStore.selectSignal(selectRecipeById(position.recipe))()?.name;
    }

    return undefined;
  }
}
