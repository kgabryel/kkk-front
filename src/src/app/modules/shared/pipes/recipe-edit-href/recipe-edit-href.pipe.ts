import {Pipe, PipeTransform} from '@angular/core';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {Recipe} from '../../../../core/models/recipe';

@Pipe({
  name: 'recipeEditHref'
})
export class RecipeEditHrefPipe implements PipeTransform {

  transform(recipe: Recipe, ...args: unknown[]): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipeEdit),
      new Map([['id', recipe.id.toString()]])
    );
  }
}
