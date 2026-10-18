import type { InputSignal, OnInit } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import type { TimerFormNames } from '@/app/core/factories/timer.factory';
import type { Timer } from '@/app/core/models/timer';
import type { TimerRequest } from '@/app/core/requests/timer.request';
import type { State } from '@/app/core/store/timers/reducers';

import { TimerFactory } from '@/app/core/factories/timer.factory';
import { timerDelete, timerUpdate } from '@/app/core/store/timers/actions';
import { TimeUtils } from '@/app/core/utils/time.utils';
import { DeleteDialogComponent } from '@/app/modules/shared/components/delete-dialog/delete-dialog.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';
import { FormComponent } from '@/app/modules/timers/components/form/form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormComponent, AutocompletePipe],
  selector: 'account-timer-edit',
  templateUrl: './timer-edit.component.html',
})
export class TimerEditComponent implements OnInit {
  public timer: InputSignal<Timer> = input.required<Timer>();
  public form!: FormGroup;
  public formNames: TimerFormNames;
  private dialog: MatDialog = inject(MatDialog);
  private store: Store<State> = inject<Store<State>>(Store);

  public ngOnInit(): void {
    this.form = TimerFactory.getEditForm(this.timer());
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () => this.store.dispatch(timerDelete({ id: this.timer().id })),
      },
      width: '800px',
    });
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
      timerUpdate({
        id: this.timer().id,
        timer: request,
      }),
    );
  }
}
