import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { messages } from '../../messages/api-keys.messages';
import { ApiKey } from '../../models/api-key';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { BaseEffect } from '../BaseEffect';
import {
  keyAdd,
  keyAddError,
  keyAddSuccess,
  keyDelete,
  keyDeleteError,
  keyDeleteSuccess,
  keysLoad,
  keysLoadError,
  keysLoadSuccess,
  keyUpdate,
  keyUpdateError,
  keyUpdateSuccess,
} from './actions';

@Injectable()
export class ApiKeysEffects extends BaseEffect<UserService> {
  public addApiKey!: Observable<Action>;
  public deleteKey!: Observable<Action>;
  public loadKeys!: Observable<Action>;
  public updateKey!: Observable<Action>;
  public constructor(
    actions: Actions,
    notificationService: NotificationService,
    router: Router,
    service: UserService,
  ) {
    super(actions, notificationService, router, service);
  }

  private static keyUpdateSuccess(key: ApiKey, id: number): ReturnType<typeof keyUpdateSuccess> {
    const update: Update<ApiKey> = { changes: key, id };

    return keyUpdateSuccess({ apiKey: update });
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
  }

  private createAddEffect(): void {
    this.addApiKey = createEffect(() =>
      this.actions.pipe(
        ofType(keyAdd),
        switchMap(() =>
          this.service.generateKey().pipe(
            tap(() => this.notificationService.showMessage(messages.keyAdded)),
            map((apiKey: ApiKey) => keyAddSuccess({ apiKey })),
            catchError((error: HttpErrorResponse) => this.error(error, keyAddError())),
          ),
        ),
      ),
    );
  }

  private createDeleteEffect(): void {
    this.deleteKey = createEffect(() =>
      this.actions.pipe(
        ofType(keyDelete),
        switchMap((action: ReturnType<typeof keyDelete>) =>
          this.service.deleteKey(action.id).pipe(
            tap(() => this.notificationService.showMessage(messages.keyDeleted)),
            map((id: number) => keyDeleteSuccess({ id })),
            catchError((error: HttpErrorResponse) => this.error(error, keyDeleteError())),
          ),
        ),
      ),
    );
  }

  private createLoadEffect(): void {
    this.loadKeys = createEffect(() =>
      this.actions.pipe(
        ofType(keysLoad),
        switchMap(() =>
          this.service.loadApiKeys().pipe(
            map((apiKeys: ApiKey[]) => keysLoadSuccess({ apiKeys })),
            catchError((error: HttpErrorResponse) => this.error(error, keysLoadError())),
          ),
        ),
      ),
    );
  }

  private createUpdateEffect(): void {
    this.updateKey = createEffect(() =>
      this.actions.pipe(
        ofType(keyUpdate),
        switchMap((action: ReturnType<typeof keyUpdate>) =>
          this.service.switchKeyActive(action.id).pipe(
            tap(() => this.notificationService.showMessage(messages.keyUpdated)),
            map((apiKey: ApiKey) => ApiKeysEffects.keyUpdateSuccess(apiKey, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, keyUpdateError())),
          ),
        ),
      ),
    );
  }
}
