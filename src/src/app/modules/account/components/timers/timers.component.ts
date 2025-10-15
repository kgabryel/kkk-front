import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { Timer } from '../../../../core/models/timer';
import { State } from '../../../../core/store/timers/reducers';
import { selectTimers } from '../../../../core/store/timers/selectors';
import { TimerAddComponent } from '../timer-add/timer-add.component';
import { TimerEditComponent } from '../timer-edit/timer-edit.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimerEditComponent, TimerAddComponent],
  selector: 'account-timers',
  standalone: true,
  styleUrls: ['./timers.component.scss'],
  templateUrl: './timers.component.html',
})
export class TimersComponent implements OnInit {
  public timers!: Signal<Timer[]>;
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.timers = this.store.selectSignal(selectTimers);
  }
}
