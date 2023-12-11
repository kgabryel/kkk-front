import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Timer} from '../../../../core/models/timer';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/timers/reducers';
import {selectTimers} from '../../../../core/store/timers/selectors';

@Component({
  selector: 'account-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimersComponent implements OnInit {

  public timers$: Observable<Timer[]>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.timers$ = this.store.select(selectTimers);
  }
}
