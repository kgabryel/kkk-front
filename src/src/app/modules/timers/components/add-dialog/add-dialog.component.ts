import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { Store } from '@ngrx/store';

import { formNames, TimerFactory, TimerFormNames } from '../../../../core/factories/timer.factory';
import { messages } from '../../../../core/messages/timers.messages';
import { Timer } from '../../../../core/models/timer';
import { NotificationService } from '../../../../core/services/notification.service';
import { TimersListService } from '../../../../core/services/timers-list.service';
import { State } from '../../../../core/store/timers/reducers';
import { selectTimers } from '../../../../core/store/timers/selectors';
import { TimeUtils } from '../../../../core/utils/time.utils';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';
import { TimerTimePipe } from '../../../shared/pipes/timer-time.pipe';
import { FormComponent } from '../form/form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogClose,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    AutocompletePipe,
    TimerTimePipe,
    MatOption,
    MatSelect,
    FormComponent,
    MatSelect,
    MatOption,
  ],
  selector: 'timers-add-dialog',
  standalone: true,
  styleUrls: [],
  templateUrl: './add-dialog.component.html',
})
export class AddDialogComponent implements OnInit {
  public addForm!: FormGroup;
  public formNames: TimerFormNames;
  public selectForm!: FormGroup;
  public timers!: Signal<Timer[]>;
  private dialogRef: MatDialogRef<AddDialogComponent>;
  private notificationService: NotificationService;
  private store: Store<State>;
  private timersListService: TimersListService;
  public constructor(
    timersListService: TimersListService,
    notificationService: NotificationService,
    dialogRef: MatDialogRef<AddDialogComponent>,
    store: Store<State>,
  ) {
    this.timersListService = timersListService;
    this.notificationService = notificationService;
    this.dialogRef = dialogRef;
    this.formNames = formNames;
    this.store = store;
  }

  public ngOnInit(): void {
    this.addForm = TimerFactory.getCreateForm();
    this.selectForm = TimerFactory.getAddForm();
    this.timers = this.store.selectSignal(selectTimers);
  }

  public submitAdd(): void {
    if (this.addForm.invalid) {
      return;
    }
    this.timersListService.addTimer({
      id: 0,
      name: this.addForm.get(this.formNames.name)?.value,
      time: TimeUtils.dateToTime(this.addForm.get(this.formNames.time)?.value),
    });
    this.notificationService.showMessage(messages.timerAdded);
    this.dialogRef.close();
  }

  public submitSelect(): void {
    if (this.selectForm.invalid) {
      return;
    }
    this.timersListService.addTimer(this.selectForm.get(this.formNames.timer)?.value);
    this.notificationService.showMessage(messages.timerAdded);
    this.dialogRef.close();
  }
}
