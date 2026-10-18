import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Tag} from '../../../../core/models/tag';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tags/reducers';
import {searchTags} from '../../../../core/store/tags/selectors';
import {TagsSearchService} from '../../../../core/services/tags-search/tags-search.service';
import {map, switchMap} from 'rxjs/operators';
import {StringUtils} from '../../../../core/utils/string.utils';

@Component({
  selector: 'tags-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsListComponent implements OnInit {

  public tags$: Observable<Tag[]>;
  private store: Store<State>;
  private tagsSearchService: TagsSearchService;

  public constructor(store: Store<State>, tagsSearchService: TagsSearchService) {
    this.store = store;
    this.tagsSearchService = tagsSearchService;
  }

  public ngOnInit(): void {
    this.tags$ = this.tagsSearchService.getState().pipe(
      switchMap(name => this.store.select(searchTags(name))),
      map(tags => tags.sort((a, b) => StringUtils.compareString(a.name, b.name)))
    );
  }
}
