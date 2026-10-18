import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatLine } from '@angular/material/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatList, MatListItem } from '@angular/material/list';

import type { FullRecipe } from '@/app/core/models/full-recipe';

import { RecipeDescriptionComponent } from '@/app/modules/recipes/components/recipe-description/recipe-description.component';
import { RecipePhotosComponent } from '@/app/modules/recipes/components/recipe-photos/recipe-photos.component';
import { RecipeUrlComponent } from '@/app/modules/recipes/components/recipe-url/recipe-url.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatList,
    MatListItem,
    MatLine,
    RecipeUrlComponent,
    RecipeDescriptionComponent,
    RecipePhotosComponent,
  ],
  selector: 'recipes-full-recipe',
  styleUrl: './full-recipe.component.scss',
  templateUrl: './full-recipe.component.html',
})
export class FullRecipeComponent {
  public recipe: InputSignal<FullRecipe> = input.required<FullRecipe>();
}
