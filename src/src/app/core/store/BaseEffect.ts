import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export abstract class BaseEffect<T> {
  protected actions: Actions;
  protected notificationService: NotificationService;
  protected service: T;
  protected router: Router;
  protected constructor(
    actions: Actions,
    notificationService: NotificationService,
    router: Router,
    service: T,
  ) {
    this.actions = actions;
    this.notificationService = notificationService;
    this.router = router;
    this.service = service;
    this.initEffects();
  }

  protected error(error: HttpErrorResponse, errorAction: Action): Observable<Action> {
    this.notificationService.showError(error.status);

    return of(errorAction);
  }

  protected abstract initEffects(): void;
}
