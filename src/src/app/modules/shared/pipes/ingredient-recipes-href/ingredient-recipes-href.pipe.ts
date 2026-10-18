import {Pipe, PipeTransform} from '@angular/core';
import {Ingredient} from '../../../../core/models/ingredient';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Pipe({
  name: 'ingredientRecipesHref'
})
export class IngredientRecipesHrefPipe implements PipeTransform {

  transform(ingredient: Ingredient, ...args: unknown[]): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.ingredients, RoutingConfig.ingredientRecipes),
      new Map([['id', ingredient.id.toString()]])
    );
  }
}
