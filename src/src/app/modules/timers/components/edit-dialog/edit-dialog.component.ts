import type { OnInit, Signal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import type { TimerFormNames } from '@/app/core/factories/timer.factory';
import type { Time } from '@/app/core/models/time';
import type { FullTimer } from '@/app/core/models/timer';
import type { AddDialogComponent } from '@/app/modules/timers/components/add-dialog/add-dialog.component';

import { Length } from '@/app/config/form.config';
import { formNames, TimerFactory } from '@/app/core/factories/timer.factory';
import { FormUtils } from '@/app/core/utils/form.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { TimePickerComponent } from '@/app/modules/shared/components/time-picker/time-picker.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogClose,
    MatButton,
    ReactiveFormsModule,
    AutocompletePipe,
    MatIcon,
    MatLabel,
    MatFormField,
    MatHint,
    MatInput,
    TimePickerComponent,
  ],
  selector: 'timers-edit-dialog',
  templateUrl: './edit-dialog.component.html',
})
export class EditDialogComponent extends BaseComponent implements OnInit {
  public formNames: TimerFormNames = formNames;
  public maxNameLength: number = Length.maxTimerNameLength;
  public nameForm!: FormGroup;
  public nameLength!: Signal<number>;
  public timeForm!: FormGroup;
  private dialogRef: MatDialogRef<AddDialogComponent> = inject<MatDialogRef<AddDialogComponent>>(MatDialogRef);
  private readonly leftTime: number;
  private readonly timer: FullTimer;
  public constructor() {
    const data = inject<EditDialogInput>(MAT_DIALOG_DATA);

    super();
    this.timer = data.timer;
    this.leftTime = data.leftTime;
  }

  public ngOnInit(): void {
    this.nameForm = TimerFactory.getNameForm(this.timer);
    this.timeForm = TimerFactory.getTimeForm(this.leftTime);
    this.nameLength = FormUtils.getLength(this.injector, this.nameForm, this.formNames.name, this.timer.name ?? '');
  }

  public submitUpdateName(): void {
    if (this.nameForm.invalid) {
      return;
    }
    this.dialogRef.close({
      name: this.nameForm.get(this.formNames.name)?.value,
    });
  }

  public submitUpdateTime(): void {
    if (this.timeForm.invalid) {
      return;
    }
    this.dialogRef.close({
      time: this.timeForm.get(this.formNames.time)?.value,
    });
  }
}

export interface EditDialogResult {
  name?: string;
  time?: Time;
}

export interface EditDialogInput {
  leftTime: number;
  timer: FullTimer;
}
