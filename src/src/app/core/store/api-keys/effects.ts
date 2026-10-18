import {Injectable} from '@angular/core';
import {BaseEffect} from '../BaseEffect';
import {UserService} from '../../services/user/user.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {NotificationService} from '../../services/notification/notification.service';
import {Router} from '@angular/router';
import * as apiKeysActions from './actions';
import {keyUpdate, keyUpdateError, keyUpdateSuccess} from './actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Update} from '@ngrx/entity';
import {ApiKey} from '../../models/api-key';
import {messages} from '../../messages/api-keys.messages';

@Injectable()
export class ApiKeysEffects extends BaseEffect<UserService> {

  loadKeys: any;
  addApiKey: any;
  deleteKey: any;
  updateKey: any;

  constructor(
    actions: Actions,
    notificationService: NotificationService,
    router: Router,
    service: UserService
  ) {
    super(actions, notificationService, router, service);
  }

  private static keyUpdateSuccess(key: ApiKey, id: number) {
    const update: Update<ApiKey> = {id, changes: key};
    return keyUpdateSuccess({apiKey: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
  }

  private createLoadEffect() {
    this.loadKeys = createEffect(() => this.actions.pipe(
      ofType(apiKeysActions.keysLoad),
      switchMap((() => this.service.loadApiKeys().pipe(
        map((apiKeys => apiKeysActions.keysLoadSuccess({apiKeys}))),
        catchError(error => this.error(error, apiKeysActions.keysLoadError()))
      )))
    ));
  }

  private createAddEffect() {
    this.addApiKey = createEffect(() =>
      this.actions.pipe(
        ofType(apiKeysActions.keyAdd),
        switchMap(() => this.service.generateKey().pipe(
          tap(() => this.notificationService.showMessage(messages.keyAdded)),
          map((apiKey => apiKeysActions.keyAddSuccess({apiKey}))),
          catchError(error => this.error(error, apiKeysActions.keyAddError()))
        ))
      ));
  }

  private createDeleteEffect() {
    this.deleteKey = createEffect(() => this.actions.pipe(
      ofType(apiKeysActions.keyDelete),
      switchMap((action => this.service.deleteKey(action.id).pipe(
        tap(() => this.notificationService.showMessage(messages.keyDeleted)),
        map((id => apiKeysActions.keyDeleteSuccess({id}))),
        catchError(error => this.error(error, apiKeysActions.keyDeleteError()))
      )))
    ));
  }

  private createUpdateEffect() {
    this.updateKey = createEffect(() => this.actions.pipe(
      ofType(keyUpdate),
      switchMap((action => this.service.switchKeyActive(action.id).pipe(
        tap(() => this.notificationService.showMessage(messages.keyUpdated)),
        map((key => ApiKeysEffects.keyUpdateSuccess(key, action.id))),
        catchError(error => this.error(error, keyUpdateError()))
      )))
    ));
  }
}
