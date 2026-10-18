import { Pipe, PipeTransform } from '@angular/core';

import { RoutingConfig } from '../../../config/routing.config';
import { Ingredient } from '../../../core/models/ingredient';
import { PathUtils } from '../../../core/utils/path.utils';

@Pipe({
  name: 'ingredientRecipesHref',
  standalone: true,
})
export class IngredientRecipesHrefPipe implements PipeTransform {
  public transform(ingredient: Ingredient): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.ingredients, RoutingConfig.ingredientRecipes),
      new Map([['id', ingredient.id.toString()]]),
    );
  }
}
