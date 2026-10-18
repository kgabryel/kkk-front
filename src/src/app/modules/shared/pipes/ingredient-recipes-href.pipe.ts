import type { PipeTransform } from '@angular/core';

import { Pipe } from '@angular/core';

import type { Ingredient } from '@/app/core/models/ingredient';

import { RoutingConfig } from '@/app/config/routing.config';
import { PathUtils } from '@/app/core/utils/path.utils';

@Pipe({
  name: 'ingredientRecipesHref',
})
export class IngredientRecipesHrefPipe implements PipeTransform {
  public transform(ingredient: Ingredient): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.ingredients, RoutingConfig.ingredientRecipes),
      new Map([['id', ingredient.id.toString()]]),
    );
  }
}
