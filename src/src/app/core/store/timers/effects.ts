import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { messages } from '../../messages/timers.messages';
import { Timer } from '../../models/timer';
import { NotificationService } from '../../services/notification.service';
import { TimersService } from '../../services/timers.service';
import { BaseEffect } from '../BaseEffect';
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
  timerUpdateSuccess,
} from './actions';

@Injectable()
export class TimersEffects extends BaseEffect<TimersService> {
  public addTimer!: Observable<Action>;
  public deleteTimer!: Observable<Action>;
  public loadTimers!: Observable<Action>;
  public updateTimer!: Observable<Action>;
  public constructor(
    actions: Actions,
    timersService: TimersService,
    router: Router,
    notificationService: NotificationService,
  ) {
    super(actions, notificationService, router, timersService);
  }

  private static timerUpdateSuccess(
    timer: Timer,
    id: number,
  ): ReturnType<typeof timerUpdateSuccess> {
    const update: Update<Timer> = { changes: timer, id };

    return timerUpdateSuccess({ timer: update });
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
  }

  private createAddEffect(): void {
    this.addTimer = createEffect(() =>
      this.actions.pipe(
        ofType(timerAdd),
        switchMap((action: ReturnType<typeof timerAdd>) =>
          this.service.add(action.timer).pipe(
            tap(() => this.notificationService.showMessage(messages.timerAdded)),
            map((timer: Timer) => timerAddSuccess({ timer })),
            catchError((error: HttpErrorResponse) => this.error(error, timerAddError())),
          ),
        ),
      ),
    );
  }

  private createDeleteEffect(): void {
    this.deleteTimer = createEffect(() =>
      this.actions.pipe(
        ofType(timerDelete),
        switchMap((action: ReturnType<typeof timerDelete>) =>
          this.service.delete(action.id).pipe(
            tap(() => this.notificationService.showMessage(messages.timerDeleted)),
            map((id: number) => timerDeleteSuccess({ id })),
            catchError((error: HttpErrorResponse) => this.error(error, timerDeleteError())),
          ),
        ),
      ),
    );
  }

  private createLoadEffect(): void {
    this.loadTimers = createEffect(() =>
      this.actions.pipe(
        ofType(timersLoad),
        switchMap(() =>
          this.service.getAll().pipe(
            map((timers: Timer[]) => timersLoadSuccess({ timers })),
            catchError((error: HttpErrorResponse) => this.error(error, timersLoadError())),
          ),
        ),
      ),
    );
  }

  private createUpdateEffect(): void {
    this.updateTimer = createEffect(() =>
      this.actions.pipe(
        ofType(timerUpdate),
        switchMap((action: ReturnType<typeof timerUpdate>) =>
          this.service.update(action.id, action.timer).pipe(
            tap(() => this.notificationService.showMessage(messages.timerUpdated)),
            map((timer: Timer) => TimersEffects.timerUpdateSuccess(timer, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, timerUpdateError())),
          ),
        ),
      ),
    );
  }
}
