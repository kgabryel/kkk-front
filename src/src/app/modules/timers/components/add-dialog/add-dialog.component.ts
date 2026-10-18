import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formNames, TimerFactory, TimerFormNames} from '../../../../core/factories/timer.factory';
import {TimersListService} from '../../../../core/services/timers-list/timers-list.service';
import {TimeUtils} from '../../../../core/utils/time.utils';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {Timer} from '../../../../core/models/timer';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/timers/reducers';
import {selectTimers} from '../../../../core/store/timers/selectors';
import {messages} from '../../../../core/messages/timers.messages';

@Component({
  selector: 'timers-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDialogComponent implements OnInit {
  public addForm: FormGroup;
  public selectForm: FormGroup;
  public formNames: TimerFormNames;
  public timers$: Observable<Timer[]>;
  private timersListService: TimersListService;
  private notificationService: NotificationService;
  private dialogRef: MatDialogRef<AddDialogComponent>;
  private store: Store<State>;

  public constructor(
    timersListService: TimersListService,
    notificationService: NotificationService,
    dialogRef: MatDialogRef<AddDialogComponent>,
    store: Store<State>
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
    this.timers$ = this.store.select(selectTimers);
  }

  public submitAdd(): void {
    if (this.addForm.invalid) {
      return;
    }
    this.timersListService.addTimer({
      id: 0,
      time: TimeUtils.dateToTime(this.addForm.get(this.formNames.time)?.value),
      name: this.addForm.get(this.formNames.name)?.value
    });
    this.notificationService.showMessage(messages.timerAdded);
    this.dialogRef.close();
  }

  public submitSelect() {
    if (this.selectForm.invalid) {
      return;
    }
    this.timersListService.addTimer(this.selectForm.get(this.formNames.timer)?.value);
    this.notificationService.showMessage(messages.timerAdded);
    this.dialogRef.close();
  }
}
