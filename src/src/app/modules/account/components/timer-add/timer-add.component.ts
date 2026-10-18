import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { formNames, TimerFactory, TimerFormNames } from '../../../../core/factories/timer.factory';
import { TimerRequest } from '../../../../core/requests/timer.request';
import { timerAdd } from '../../../../core/store/timers/actions';
import { State } from '../../../../core/store/timers/reducers';
import { FormUtils } from '../../../../core/utils/form.utils';
import { TimeUtils } from '../../../../core/utils/time.utils';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';
import { FormComponent } from '../../../timers/components/form/form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormComponent, AutocompletePipe],
  selector: 'account-timer-add',
  standalone: true,
  styleUrls: [],
  templateUrl: './timer-add.component.html',
})
export class TimerAddComponent implements OnInit {
  public form!: FormGroup;
  public formNames: TimerFormNames;
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.formNames = formNames;
    this.store = store;
  }

  public ngOnInit(): void {
    this.form = TimerFactory.getCreateForm();
  }

  public clearForm(): void {
    const time = new Date();
    time.setHours(0, 0, 0);
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    FormUtils.clearInputs(this.form, time, this.formNames.time);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const request: TimerRequest = {
      name: this.form.get(this.formNames.name)?.value,
      time: TimeUtils.dateToTime(this.form.get(this.formNames.time)?.value),
    };
    this.store.dispatch(
      timerAdd({
        timer: request,
      }),
    );
    this.clearForm();
  }
}
