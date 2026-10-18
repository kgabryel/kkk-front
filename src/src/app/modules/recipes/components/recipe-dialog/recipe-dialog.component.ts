import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Recipe } from '../../../../core/models/recipe';
import { RecipePreviewComponent } from '../recipe-preview/recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipePreviewComponent],
  selector: 'recipes-recipe-dialog',
  standalone: true,
  styleUrls: ['./recipe-dialog.component.scss'],
  templateUrl: './recipe-dialog.component.html',
})
export class RecipeDialogComponent {
  public recipe: Recipe;
  public constructor(@Inject(MAT_DIALOG_DATA) data: RecipeDialogInput) {
    this.recipe = data.recipe;
  }
}

export interface RecipeDialogInput {
  recipe: Recipe;
}
