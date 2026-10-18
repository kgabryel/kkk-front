import type { PipeTransform } from '@angular/core';

import { Pipe } from '@angular/core';

import type { Recipe } from '@/app/core/models/recipe';

import { RoutingConfig } from '@/app/config/routing.config';
import { PathUtils } from '@/app/core/utils/path.utils';

@Pipe({
  name: 'recipeEditHref',
})
export class RecipeEditHrefPipe implements PipeTransform {
  public transform(recipe: Recipe): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipeEdit),
      new Map([['id', recipe.id.toString()]]),
    );
  }
}
