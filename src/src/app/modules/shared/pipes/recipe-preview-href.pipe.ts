import { Pipe, PipeTransform } from '@angular/core';

import { RoutingConfig } from '../../../config/routing.config';
import { Recipe } from '../../../core/models/recipe';
import { PathUtils } from '../../../core/utils/path.utils';

@Pipe({
  name: 'recipePreviewHref',
  standalone: true,
})
export class RecipePreviewHrefPipe implements PipeTransform {
  public transform(recipe: Recipe): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipe),
      new Map([['id', recipe.id.toString()]]),
    );
  }
}
