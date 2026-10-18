import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatList } from '@angular/material/list';
import { Store } from '@ngrx/store';

import type { Season } from '@/app/core/models/season';
import type { Search } from '@/app/core/services/seasons-search.service';
import type { State } from '@/app/core/store/seasons/reducers';

import { SeasonsSearchService } from '@/app/core/services/seasons-search.service';
import { searchSeasons } from '@/app/core/store/seasons/selectors';
import { SearchUtils } from '@/app/core/utils/search.utils';
import { SeasonContainerComponent } from '@/app/modules/seasons/components/season-container/season-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatList, SeasonContainerComponent],
  selector: 'seasons-seasons-list',
  styleUrl: './seasons-list.component.scss',
  templateUrl: './seasons-list.component.html',
})
export class SeasonsListComponent implements OnInit {
  public seasons!: Signal<Season[]>;
  private readonly seasonsSearchService: SeasonsSearchService = inject(SeasonsSearchService);
  private readonly store: Store<State> = inject<Store<State>>(Store);

  public ngOnInit(): void {
    this.seasons = SearchUtils.search<Search, Season, State>(
      this.seasonsSearchService,
      this.store,
      (search: Search) => searchSeasons(search),
      (seasons: Season[]) => [...seasons].sort((a: Season, b: Season) => a.start - b.start || a.stop - b.stop),
    );
  }
}
