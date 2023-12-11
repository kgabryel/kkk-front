import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/seasons/reducers';
import {searchSeasons} from '../../../../core/store/seasons/selectors';
import {Season} from '../../../../core/models/season';
import {SeasonsSearchService} from '../../../../core/services/seasons-search/seasons-search.service';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'seasons-seasons-list',
  templateUrl: './seasons-list.component.html',
  styleUrls: ['./seasons-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonsListComponent implements OnInit {

  public seasons$: Observable<Season[]>;
  private store: Store<State>;
  private seasonsSearchService: SeasonsSearchService;

  public constructor(store: Store<State>, seasonsSearchService: SeasonsSearchService) {
    this.store = store;
    this.seasonsSearchService = seasonsSearchService;
  }

  public ngOnInit(): void {
    this.seasons$ = this.seasonsSearchService.getState().pipe(
      switchMap(search => this.store.select(searchSeasons(search))),
      map(seasons => seasons.sort((a, b) => a.start - b.start))
    );
  }
}
