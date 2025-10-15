import { ChangeDetectionStrategy, Component, Inject, OnInit, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { Length } from '../../../../config/form.config';
import { formNames, TimerFactory, TimerFormNames } from '../../../../core/factories/timer.factory';
import { Time } from '../../../../core/models/time';
import { FullTimer } from '../../../../core/models/timer';
import { FormUtils } from '../../../../core/utils/form.utils';
import { BaseComponent } from '../../../base.component';
import { TimePickerComponent } from '../../../shared/components/time-picker/time-picker.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';

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
  standalone: true,
  styleUrls: [],
  templateUrl: './edit-dialog.component.html',
})
export class EditDialogComponent extends BaseComponent implements OnInit {
  public formNames: TimerFormNames;
  public maxNameLength: number;
  public nameForm!: FormGroup;
  public nameLength!: Signal<number>;
  public timeForm!: FormGroup;
  private dialogRef: MatDialogRef<AddDialogComponent>;
  private readonly leftTime: number;
  private readonly timer: FullTimer;
  public constructor(
    @Inject(MAT_DIALOG_DATA) data: EditDialogInput,
    dialogRef: MatDialogRef<AddDialogComponent>,
  ) {
    super();
    this.dialogRef = dialogRef;
    this.formNames = formNames;
    this.timer = data.timer;
    this.maxNameLength = Length.maxTimerNameLength;
    this.leftTime = data.leftTime;
  }

  public ngOnInit(): void {
    this.nameForm = TimerFactory.getNameForm(this.timer);
    this.timeForm = TimerFactory.getTimeForm(this.leftTime);
    this.nameLength = FormUtils.getLength(
      this.injector,
      this.nameForm,
      this.formNames.name,
      this.timer.name ?? '',
    );
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
