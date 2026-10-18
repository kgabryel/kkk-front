import type { PipeTransform } from '@angular/core';

import { Pipe } from '@angular/core';

import type { Tag } from '@/app/core/models/tag';

import { RoutingConfig } from '@/app/config/routing.config';
import { PathUtils } from '@/app/core/utils/path.utils';

@Pipe({
  name: 'tagRecipesHref',
})
export class TagRecipesHrefPipe implements PipeTransform {
  public transform(tag: Tag): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.tags, RoutingConfig.tagRecipes),
      new Map([['id', tag.id.toString()]]),
    );
  }
}
