import type { OnInit } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import type { TimerFormNames } from '@/app/core/factories/timer.factory';
import type { TimerRequest } from '@/app/core/requests/timer.request';
import type { State } from '@/app/core/store/timers/reducers';

import { formNames, TimerFactory } from '@/app/core/factories/timer.factory';
import { timerAdd } from '@/app/core/store/timers/actions';
import { FormUtils } from '@/app/core/utils/form.utils';
import { TimeUtils } from '@/app/core/utils/time.utils';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';
import { FormComponent } from '@/app/modules/timers/components/form/form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormComponent, AutocompletePipe],
  selector: 'account-timer-add',
  templateUrl: './timer-add.component.html',
})
export class TimerAddComponent implements OnInit {
  public form!: FormGroup;
  public formNames: TimerFormNames = formNames;
  private store: Store<State> = inject<Store<State>>(Store);

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
