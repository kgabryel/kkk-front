import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Timer} from '../../../../core/models/timer';
import {FormGroup} from '@angular/forms';
import {formNames, TimerFactory, TimerFormNames} from '../../../../core/factories/timer.factory';
import {TimerRequest} from '../../../../core/requests/timer.request';
import {timerDelete, timerUpdate} from '../../../../core/store/timers/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/timers/reducers';
import {TimeUtils} from '../../../../core/utils/time.utils';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'account-timer-edit',
  templateUrl: './timer-edit.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerEditComponent implements OnInit {

  @Input() public timer: Timer;
  public form: FormGroup;
  public formNames: TimerFormNames;
  private store: Store<State>;
  private dialog: MatDialog;

  public constructor(store: Store<State>, dialog: MatDialog) {
    this.formNames = formNames;
    this.store = store;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.form = TimerFactory.getEditForm(this.timer);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const request: TimerRequest = {
      name: this.form.get(this.formNames.name)?.value,
      time: TimeUtils.dateToTime(this.form.get(this.formNames.time)?.value)
    };
    this.store.dispatch(timerUpdate({
      id: this.timer.id,
      timer: request
    }));
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {
        onClose: () => this.store.dispatch(timerDelete({id: this.timer.id}))
      }
    });
  }
}
