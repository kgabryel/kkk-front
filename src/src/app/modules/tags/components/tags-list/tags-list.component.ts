import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatList } from '@angular/material/list';
import { Store } from '@ngrx/store';

import type { Tag } from '@/app/core/models/tag';
import type { State } from '@/app/core/store/tags/reducers';

import { TagsSearchService } from '@/app/core/services/tags-search.service';
import { searchTags } from '@/app/core/store/tags/selectors';
import { SearchUtils } from '@/app/core/utils/search.utils';
import { TagContainerComponent } from '@/app/modules/tags/components/tag-container/tag-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagContainerComponent, MatList],
  selector: 'tags-tags-list',
  styleUrl: './tags-list.component.scss',
  templateUrl: './tags-list.component.html',
})
export class TagsListComponent implements OnInit {
  public tags!: Signal<Tag[]>;
  private readonly store: Store<State> = inject<Store<State>>(Store);
  private readonly tagsSearchService: TagsSearchService = inject(TagsSearchService);

  public ngOnInit(): void {
    this.tags = SearchUtils.search<string, Tag, State>(this.tagsSearchService, this.store, (search: string) =>
      searchTags(search),
    );
  }
}
