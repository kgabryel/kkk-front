import type { InputSignal, OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { Tag } from '@/app/core/models/tag';
import type { State as TagsState } from '@/app/core/store/tags/reducers';

import { selectTagsForRecipe } from '@/app/core/store/tags/selectors';
import { BaseComponent } from '@/app/modules/base.component';
import { IngredientPositionComponent } from '@/app/modules/recipes/components/ingredient-position/ingredient-position.component';
import { RecipeActionsComponent } from '@/app/modules/recipes/components/recipe-actions/recipe-actions.component';
import { RecipeDescriptionComponent } from '@/app/modules/recipes/components/recipe-description/recipe-description.component';
import { RecipePhotosComponent } from '@/app/modules/recipes/components/recipe-photos/recipe-photos.component';
import { RecipePositionComponent } from '@/app/modules/recipes/components/recipe-position/recipe-position.component';
import { RecipeTimersComponent } from '@/app/modules/recipes/components/recipe-timers/recipe-timers.component';
import { RecipeUrlComponent } from '@/app/modules/recipes/components/recipe-url/recipe-url.component';
import { CalculateAmountPipe } from '@/app/modules/shared/pipes/calculate-amount.pipe';
import { FindIngredientPipe } from '@/app/modules/shared/pipes/find-ingredient.pipe';
import { FindRecipePipe } from '@/app/modules/shared/pipes/find-recipe.pipe';
import { TagRecipesHrefPipe } from '@/app/modules/shared/pipes/tag-recipes-href.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    RouterLink,
    TagRecipesHrefPipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatList,
    IngredientPositionComponent,
    CalculateAmountPipe,
    FindIngredientPipe,
    RecipePositionComponent,
    FindRecipePipe,
    RecipeUrlComponent,
    RecipeDescriptionComponent,
    RecipePhotosComponent,
    RecipeActionsComponent,
    RecipeTimersComponent,
  ],
  selector: 'recipes-recipe-preview',
  styleUrl: './recipe-preview.component.scss',
  templateUrl: './recipe-preview.component.html',
})
export class RecipePreviewComponent extends BaseComponent implements OnInit {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public buttons: InputSignal<boolean> = input<boolean>(true);
  public portions!: number;
  public previewAvailable: InputSignal<boolean> = input<boolean>(true);
  public tags!: Signal<Tag[]>;
  private tagsStore: Store<TagsState> = inject<Store<TagsState>>(Store);

  public ngOnInit(): void {
    this.tags = this.tagsStore.selectSignal(selectTagsForRecipe(this.recipe()));
    this.portions = this.recipe().portions;
  }

  public decrementPortion(): void {
    this.portions--;
  }

  public incrementPortion(): void {
    this.portions++;
  }
}
