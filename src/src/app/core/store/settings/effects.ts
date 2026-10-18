import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { messages } from '../../messages/account.messages';
import { Settings } from '../../models/settings';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { BaseEffect } from '../BaseEffect';
import {
  settingsLoad,
  settingsLoadError,
  settingsLoadSuccess,
  updateError,
  updateSuccess,
  switchAutocomplete,
  changeOzaKey,
} from './actions';

@Injectable()
export class SettingsEffects extends BaseEffect<UserService> {
  public changeOzaKey!: Observable<Action>;
  public loadSettings!: Observable<Action>;
  public switchAutocomplete!: Observable<Action>;
  public constructor(
    actions: Actions,
    notificationService: NotificationService,
    router: Router,
    service: UserService,
  ) {
    super(actions, notificationService, router, service);
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createSwitchAutocompleteEffect();
    this.createChangeOzaKeyEffect();
  }

  private createChangeOzaKeyEffect(): void {
    this.changeOzaKey = createEffect(() =>
      this.actions.pipe(
        ofType(changeOzaKey),
        switchMap((action: ReturnType<typeof changeOzaKey>) =>
          this.service.changeOzaKey(action.key).pipe(
            tap(() => this.notificationService.showMessage(messages.settingsUpdated)),
            map((settings: Settings) => updateSuccess({ settings })),
            catchError((error: HttpErrorResponse) => this.error(error, updateError())),
          ),
        ),
      ),
    );
  }

  private createLoadEffect(): void {
    this.loadSettings = createEffect(() =>
      this.actions.pipe(
        ofType(settingsLoad),
        switchMap(() =>
          this.service.loadSettings().pipe(
            map((settings: Settings) => settingsLoadSuccess({ settings })),
            catchError((error: HttpErrorResponse) => this.error(error, settingsLoadError())),
          ),
        ),
      ),
    );
  }

  private createSwitchAutocompleteEffect(): void {
    this.switchAutocomplete = createEffect(() =>
      this.actions.pipe(
        ofType(switchAutocomplete),
        switchMap(() =>
          this.service.switchAutocomplete().pipe(
            tap(() => this.notificationService.showMessage(messages.settingsUpdated)),
            map((settings: Settings) => updateSuccess({ settings })),
            catchError((error: HttpErrorResponse) => this.error(error, updateError())),
          ),
        ),
      ),
    );
  }
}
