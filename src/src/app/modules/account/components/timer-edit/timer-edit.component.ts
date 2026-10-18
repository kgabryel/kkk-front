import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { formNames, TimerFactory, TimerFormNames } from '../../../../core/factories/timer.factory';
import { Timer } from '../../../../core/models/timer';
import { TimerRequest } from '../../../../core/requests/timer.request';
import { timerDelete, timerUpdate } from '../../../../core/store/timers/actions';
import { State } from '../../../../core/store/timers/reducers';
import { TimeUtils } from '../../../../core/utils/time.utils';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';
import { FormComponent } from '../../../timers/components/form/form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormComponent, AutocompletePipe],
  selector: 'account-timer-edit',
  standalone: true,
  styleUrls: [],
  templateUrl: './timer-edit.component.html',
})
export class TimerEditComponent implements OnInit {
  public timer = input.required<Timer>();
  public form!: FormGroup;
  public formNames: TimerFormNames;
  private dialog: MatDialog;
  private store: Store<State>;
  public constructor(store: Store<State>, dialog: MatDialog) {
    this.formNames = formNames;
    this.store = store;
    this.dialog = dialog;
  }

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
