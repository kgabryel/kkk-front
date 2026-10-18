import {Actions} from '@ngrx/effects';
import {NotificationService} from '../services/notification/notification.service';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

export abstract class BaseEffect<T> {
  protected actions: Actions;
  protected notificationService: NotificationService;
  protected service: T;
  protected router: Router;

  protected constructor(actions: Actions, notificationService: NotificationService, router: Router, service: T) {
    this.actions = actions;
    this.notificationService = notificationService;
    this.router = router;
    this.service = service;
    this.initEffects();
  }

  protected abstract initEffects(): void;

  protected error(error: HttpErrorResponse, errorAction: any) {
    this.notificationService.showError(error.status);
    return of(errorAction);
  }
}
