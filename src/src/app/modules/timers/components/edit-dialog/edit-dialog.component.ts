import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';
import {FullTimer} from '../../../../core/models/timer';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames, TimerFactory, TimerFormNames} from '../../../../core/factories/timer.factory';
import {Observable, Subscription} from 'rxjs';
import {Length} from '../../../../config/form.config';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'timers-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDialogComponent implements OnInit, OnDestroy {
  public nameForm: FormGroup;
  public timeForm: FormGroup;
  public formNames: TimerFormNames;
  public maxNameLength: number;
  public nameLength$: Observable<number>;
  private notificationService: NotificationService;
  private dialogRef: MatDialogRef<AddDialogComponent>;
  private readonly leftTime: number;
  private readonly timer: FullTimer;
  private subscription: Subscription | undefined;

  public constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    notificationService: NotificationService,
    dialogRef: MatDialogRef<AddDialogComponent>
  ) {
    this.notificationService = notificationService;
    this.dialogRef = dialogRef;
    this.formNames = formNames;
    this.timer = data.timer;
    this.maxNameLength = Length.maxTimerNameLength;
    this.leftTime = data.leftTime;
  }

  public ngOnInit(): void {
    this.nameForm = TimerFactory.getNameForm(this.timer);
    this.timeForm = TimerFactory.getTimeForm(this.leftTime);
    this.nameLength$ = (this.nameForm.get(this.formNames.name) as FormControl).valueChanges.pipe(
      startWith(this.timer.name ?? ''),
      map(value => value.length)
    );
  }

  public submitUpdateName(): void {
    if (this.nameForm.invalid) {
      return;
    }
    this.dialogRef.close({
      name: this.nameForm.get(this.formNames.name)?.value
    });
  }

  public submitUpdateTime(): void {
    if (this.timeForm.invalid) {
      return;
    }
    this.dialogRef.close({
      time: this.timeForm.get(this.formNames.time)?.value
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
