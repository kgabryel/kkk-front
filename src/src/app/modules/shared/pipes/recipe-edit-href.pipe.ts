import { Pipe, PipeTransform } from '@angular/core';

import { RoutingConfig } from '../../../config/routing.config';
import { Recipe } from '../../../core/models/recipe';
import { PathUtils } from '../../../core/utils/path.utils';

@Pipe({
  name: 'recipeEditHref',
  standalone: true,
})
export class RecipeEditHrefPipe implements PipeTransform {
  public transform(recipe: Recipe): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipeEdit),
      new Map([['id', recipe.id.toString()]]),
    );
  }
}
