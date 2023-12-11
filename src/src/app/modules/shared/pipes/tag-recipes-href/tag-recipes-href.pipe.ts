import {Pipe, PipeTransform} from '@angular/core';
import {Tag} from '../../../../core/models/tag';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Pipe({
  name: 'tagRecipesHref'
})
export class TagRecipesHrefPipe implements PipeTransform {

  transform(tag: Tag, ...args: unknown[]): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.tags, RoutingConfig.tagRecipes),
      new Map([['id', tag.id.toString()]])
    );
  }
}
