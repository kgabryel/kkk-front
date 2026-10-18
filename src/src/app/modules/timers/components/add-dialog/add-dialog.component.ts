import type { OnInit, Signal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { Store } from '@ngrx/store';

import type { TimerFormNames } from '@/app/core/factories/timer.factory';
import type { Timer } from '@/app/core/models/timer';
import type { State } from '@/app/core/store/timers/reducers';

import { formNames, TimerFactory } from '@/app/core/factories/timer.factory';
import { messages } from '@/app/core/messages/timers.messages';
import { NotificationService } from '@/app/core/services/notification.service';
import { TimersListService } from '@/app/core/services/timers-list.service';
import { selectTimers } from '@/app/core/store/timers/selectors';
import { TimeUtils } from '@/app/core/utils/time.utils';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';
import { TimerTimePipe } from '@/app/modules/shared/pipes/timer-time.pipe';
import { FormComponent } from '@/app/modules/timers/components/form/form.component';

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
  templateUrl: './add-dialog.component.html',
})
export class AddDialogComponent implements OnInit {
  public addForm!: FormGroup;
  public formNames: TimerFormNames = formNames;
  public selectForm!: FormGroup;
  public timers!: Signal<Timer[]>;
  private dialogRef: MatDialogRef<AddDialogComponent> = inject<MatDialogRef<AddDialogComponent>>(MatDialogRef);
  private notificationService: NotificationService = inject(NotificationService);
  private store: Store<State> = inject<Store<State>>(Store);
  private timersListService: TimersListService = inject(TimersListService);

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
