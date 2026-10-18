import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Recipe } from '@/app/core/models/recipe';

import { RecipePreviewComponent } from '@/app/modules/recipes/components/recipe-preview/recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipePreviewComponent],
  selector: 'recipes-recipes-list',
  styleUrl: './recipes-list.component.scss',
  templateUrl: './recipes-list.component.html',
})
export class RecipesListComponent {
  public recipes: InputSignal<Recipe[]> = input.required<Recipe[]>();
}
