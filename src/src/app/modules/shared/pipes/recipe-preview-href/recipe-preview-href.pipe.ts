import {Pipe, PipeTransform} from '@angular/core';
import {Recipe} from '../../../../core/models/recipe';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Pipe({
  name: 'recipePreviewHref'
})
export class RecipePreviewHrefPipe implements PipeTransform {

  transform(recipe: Recipe, ...args: unknown[]): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipe),
      new Map([['id', recipe.id.toString()]])
    );
  }
}
