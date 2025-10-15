import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatList } from '@angular/material/list';
import { Store } from '@ngrx/store';

import { Season } from '../../../../core/models/season';
import { Search, SeasonsSearchService } from '../../../../core/services/seasons-search.service';
import { State } from '../../../../core/store/seasons/reducers';
import { searchSeasons } from '../../../../core/store/seasons/selectors';
import { SearchUtils } from '../../../../core/utils/search.utils';
import { SeasonContainerComponent } from '../season-container/season-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatList, SeasonContainerComponent],
  selector: 'seasons-seasons-list',
  standalone: true,
  styleUrls: ['./seasons-list.component.scss'],
  templateUrl: './seasons-list.component.html',
})
export class SeasonsListComponent implements OnInit {
  public seasons!: Signal<Season[]>;
  private readonly seasonsSearchService: SeasonsSearchService;
  private readonly store: Store<State>;
  public constructor(store: Store<State>, seasonsSearchService: SeasonsSearchService) {
    this.store = store;
    this.seasonsSearchService = seasonsSearchService;
  }

  public ngOnInit(): void {
    this.seasons = SearchUtils.search<Search, Season, State>(
      this.seasonsSearchService,
      this.store,
      (search: Search) => searchSeasons(search),
      (seasons: Season[]) => [...seasons].sort((a: Season, b: Season) => a.start - b.start),
    );
  }
}
