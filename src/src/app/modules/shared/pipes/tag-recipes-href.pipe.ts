import { Pipe, PipeTransform } from '@angular/core';

import { RoutingConfig } from '../../../config/routing.config';
import { Tag } from '../../../core/models/tag';
import { PathUtils } from '../../../core/utils/path.utils';

@Pipe({
  name: 'tagRecipesHref',
  standalone: true,
})
export class TagRecipesHrefPipe implements PipeTransform {
  public transform(tag: Tag): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.tags, RoutingConfig.tagRecipes),
      new Map([['id', tag.id.toString()]]),
    );
  }
}
