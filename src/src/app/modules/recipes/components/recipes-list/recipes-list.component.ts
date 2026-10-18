import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

import { Recipe } from '../../../../core/models/recipe';
import { RecipePreviewComponent } from '../recipe-preview/recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipePreviewComponent],
  selector: 'recipes-recipes-list',
  standalone: true,
  styleUrls: ['./recipes-list.component.scss'],
  templateUrl: './recipes-list.component.html',
})
export class RecipesListComponent {
  public recipes: InputSignal<Recipe[]> = input.required<Recipe[]>();
}
