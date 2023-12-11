import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formNames, TimerFactory, TimerFormNames} from '../../../../core/factories/timer.factory';
import {timerAdd} from '../../../../core/store/timers/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/timers/reducers';
import {TimerRequest} from '../../../../core/requests/timer.request';
import {TimeUtils} from '../../../../core/utils/time.utils';
import {FormUtils} from '../../../../core/utils/form.utils';

@Component({
  selector: 'account-timer-add',
  templateUrl: './timer-add.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerAddComponent implements OnInit {
  public form: FormGroup;
  public formNames: TimerFormNames;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.formNames = formNames;
    this.store = store;
  }

  public ngOnInit(): void {
    this.form = TimerFactory.getCreateForm();
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const request: TimerRequest = {
      name: this.form.get(this.formNames.name)?.value,
      time: TimeUtils.dateToTime(this.form.get(this.formNames.time)?.value)
    };
    this.store.dispatch(timerAdd({
      timer: request
    }));
    this.clearForm();
  }

  public clearForm(): void {
    const time = new Date();
    time.setHours(0, 0, 0);
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    FormUtils.clearInputs(this.form, time, this.formNames.time);
  }
}
