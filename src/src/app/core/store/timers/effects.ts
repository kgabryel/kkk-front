import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {TimersService} from '../../services/timers/timers.service';
import {NotificationService} from '../../services/notification/notification.service';
import {
  timerAdd,
  timerAddError,
  timerAddSuccess,
  timerDelete,
  timerDeleteError,
  timerDeleteSuccess,
  timersLoad,
  timersLoadError,
  timersLoadSuccess,
  timerUpdate,
  timerUpdateError,
  timerUpdateSuccess
} from './actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Update} from '@ngrx/entity';
import {Timer} from '../../models/timer';
import {BaseEffect} from '../BaseEffect';
import {messages} from '../../messages/timers.messages';

@Injectable()
export class TimersEffects extends BaseEffect<TimersService> {

  loadTimers: any;
  addTimer: any;
  deleteTimer: any;
  updateTimer: any;

  constructor(
    actions: Actions,
    timersService: TimersService,
    router: Router,
    notificationService: NotificationService
  ) {
    super(actions, notificationService, router, timersService);
  }

  private static timerUpdateSuccess(timer: Timer, id: number) {
    const update: Update<Timer> = {id, changes: timer};
    return timerUpdateSuccess({timer: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
  }

  private createLoadEffect() {
    this.loadTimers = createEffect(() => this.actions.pipe(
      ofType(timersLoad),
      switchMap((() => this.service.getAll().pipe(
        map((timers => timersLoadSuccess({timers}))),
        catchError(error => this.error(error, timersLoadError()))
      )))
    ));
  }

  private createAddEffect() {
    this.addTimer = createEffect(() =>
      this.actions.pipe(
        ofType(timerAdd),
        switchMap(action => this.service.add(action.timer).pipe(
          tap(() => this.notificationService.showMessage(messages.timerAdded)),
          map((timer => timerAddSuccess({timer}))),
          catchError(error => this.error(error, timerAddError()))
        ))
      ));
  }

  private createDeleteEffect() {
    this.deleteTimer = createEffect(() => this.actions.pipe(
      ofType(timerDelete),
      switchMap((action => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage(messages.timerDeleted)),
        map((id => timerDeleteSuccess({id}))),
        catchError(error => this.error(error, timerDeleteError()))
      )))
    ));
  }

  private createUpdateEffect() {
    this.updateTimer = createEffect(() => this.actions.pipe(
      ofType(timerUpdate),
      switchMap((action => this.service.update(action.id, action.timer).pipe(
        tap(() => this.notificationService.showMessage(messages.timerUpdated)),
        map((timer => TimersEffects.timerUpdateSuccess(timer, action.id))),
        catchError(error => this.error(error, timerUpdateError()))
      )))
    ));
  }
}
