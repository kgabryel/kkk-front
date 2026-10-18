import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import type { Recipe } from '@/app/core/models/recipe';

import { RecipePreviewComponent } from '@/app/modules/recipes/components/recipe-preview/recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipePreviewComponent],
  selector: 'recipes-recipe-dialog',
  styleUrl: './recipe-dialog.component.scss',
  templateUrl: './recipe-dialog.component.html',
})
export class RecipeDialogComponent {
  public recipe: Recipe;
  public constructor() {
    const data = inject<RecipeDialogInput>(MAT_DIALOG_DATA);

    this.recipe = data.recipe;
  }
}

export interface RecipeDialogInput {
  recipe: Recipe;
}
