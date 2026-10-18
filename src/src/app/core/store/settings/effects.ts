import type { HttpErrorResponse } from '@angular/common/http';
import type { Action } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import type { Settings } from '@/app/core/models/settings';

import { messages } from '@/app/core/messages/account.messages';
import { UserService } from '@/app/core/services/user.service';
import { BaseEffect } from '@/app/core/store/BaseEffect';

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
  protected readonly service: UserService = inject(UserService);

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
