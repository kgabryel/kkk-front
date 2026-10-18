import {Injectable} from '@angular/core';
import {BaseEffect} from '../BaseEffect';
import {UserService} from '../../services/user/user.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {NotificationService} from '../../services/notification/notification.service';
import {Router} from '@angular/router';
import * as settingsActions from './actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {messages} from '../../messages/account.messages';

@Injectable()
export class SettingsEffects extends BaseEffect<UserService> {

  loadSettings: any;
  switchAutocomplete: any;
  changeOzaKey: any;

  constructor(
    actions: Actions,
    notificationService: NotificationService,
    router: Router,
    service: UserService
  ) {
    super(actions, notificationService, router, service);
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createSwitchAutocomplete();
    this.createChangeOzaKey();
  }

  private createLoadEffect() {
    this.loadSettings = createEffect(() => this.actions.pipe(
      ofType(settingsActions.settingsLoad),
      switchMap((() => this.service.loadSettings().pipe(
        map((settings => settingsActions.settingsLoadSuccess({settings}))),
        catchError(error => this.error(error, settingsActions.settingsLoadError()))
      )))
    ));
  }

  private createSwitchAutocomplete() {
    this.switchAutocomplete = createEffect(() => this.actions.pipe(
      ofType(settingsActions.switchAutocomplete),
      switchMap((() => this.service.switchAutocomplete().pipe(
        tap(() => this.notificationService.showMessage(messages.settingsUpdated)),
        map((settings => settingsActions.updateSuccess({settings}))),
        catchError(error => this.error(error, settingsActions.updateError()))
      )))
    ));
  }

  private createChangeOzaKey() {
    this.changeOzaKey = createEffect(() => this.actions.pipe(
      ofType(settingsActions.changeOzaKey),
      switchMap((action => this.service.changeOzaKey(action.key).pipe(
        tap(() => this.notificationService.showMessage(messages.settingsUpdated)),
        map((settings => settingsActions.updateSuccess({settings}))),
        catchError(error => this.error(error, settingsActions.updateError()))
      )))
    ));
  }
}
