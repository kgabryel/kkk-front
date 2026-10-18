import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { Timer } from '@/app/core/models/timer';
import type { State } from '@/app/core/store/timers/reducers';

import { selectTimers } from '@/app/core/store/timers/selectors';
import { TimerAddComponent } from '@/app/modules/account/components/timer-add/timer-add.component';
import { TimerEditComponent } from '@/app/modules/account/components/timer-edit/timer-edit.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimerEditComponent, TimerAddComponent],
  selector: 'account-timers',
  styleUrl: './timers.component.scss',
  templateUrl: './timers.component.html',
})
export class TimersComponent implements OnInit {
  public timers!: Signal<Timer[]>;
  private store: Store<State> = inject<Store<State>>(Store);

  public ngOnInit(): void {
    this.timers = this.store.selectSignal(selectTimers);
  }
}
