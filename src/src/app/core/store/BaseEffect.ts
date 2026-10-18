import type { HttpErrorResponse } from '@angular/common/http';
import type { Action } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';

import { NotificationService } from '@/app/core/services/notification.service';

export abstract class BaseEffect<T> {
  protected actions: Actions = inject(Actions);
  protected notificationService: NotificationService = inject(NotificationService);
  protected abstract readonly service: T;
  protected router: Router = inject(Router);
  public constructor() {
    this.initEffects();
  }

  protected error(error: HttpErrorResponse, errorAction: Action): Observable<Action> {
    this.notificationService.showError(error.status);

    return of(errorAction);
  }

  protected abstract initEffects(): void;
}
