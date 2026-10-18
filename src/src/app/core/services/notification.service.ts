import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { RoutingConfig } from '@/app/config/routing.config';
import { messages } from '@/app/core/messages/shared.messages';
import { PathUtils } from '@/app/core/utils/path.utils';

type NotificationType = 'error' | 'success' | 'warning';

const NOTIFICATION_DURATION = 40000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private router: Router = inject(Router);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  public showError(error: number): void {
    if (error === 401) {
      void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
    } else if (error === 400 || error === 404 || error === 422) {
      this.show('error', messages.invalidData);
    } else if (error >= 500) {
      this.show('error', messages.serverError);
    }
  }

  public showErrorMessage(message: string): void {
    this.show('error', message);
  }

  public showMessage(message: string): void {
    this.show('success', message);
  }

  private show(type: NotificationType, message: string): void {
    this.snackBar.open(message, undefined, {
      duration: NOTIFICATION_DURATION,
      horizontalPosition: 'right',
      panelClass: `notification-${type}`,
      verticalPosition: 'top',
    });
  }
}
