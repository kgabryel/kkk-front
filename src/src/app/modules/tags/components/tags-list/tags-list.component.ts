import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatList } from '@angular/material/list';
import { Store } from '@ngrx/store';

import { Tag } from '../../../../core/models/tag';
import { TagsSearchService } from '../../../../core/services/tags-search.service';
import { State } from '../../../../core/store/tags/reducers';
import { searchTags } from '../../../../core/store/tags/selectors';
import { SearchUtils } from '../../../../core/utils/search.utils';
import { StringUtils } from '../../../../core/utils/string.utils';
import { TagContainerComponent } from '../tag-container/tag-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagContainerComponent, MatList],
  selector: 'tags-tags-list',
  standalone: true,
  styleUrls: ['./tags-list.component.scss'],
  templateUrl: './tags-list.component.html',
})
export class TagsListComponent implements OnInit {
  public tags!: Signal<Tag[]>;
  private readonly store: Store<State>;
  private readonly tagsSearchService: TagsSearchService;
  public constructor(store: Store<State>, tagsSearchService: TagsSearchService) {
    this.store = store;
    this.tagsSearchService = tagsSearchService;
  }

  public ngOnInit(): void {
    this.tags = SearchUtils.search<string, Tag, State>(
      this.tagsSearchService,
      this.store,
      (search: string) => searchTags(search),
      (tags: Tag[]) =>
        [...tags].sort((a: Tag, b: Tag) => StringUtils.compareString(a.name, b.name)),
    );
  }
}
