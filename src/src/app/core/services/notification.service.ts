import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { RoutingConfig } from '../../config/routing.config';
import { messages } from '../messages/shared.messages';
import { PathUtils } from '../utils/path.utils';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private router: Router;
  private toastrService: ToastrService;
  public constructor(toastrService: ToastrService, router: Router) {
    this.toastrService = toastrService;
    this.router = router;
  }

  public showError(error: number): void {
    if (error === 401) {
      void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
    } else if (error === 400 || error === 404 || error === 422) {
      this.showSnackBar('error', messages.invalidData);
    } else if (error >= 500) {
      this.showSnackBar('error', messages.serverError);
    }
  }

  public showErrorMessage(message: string): void {
    this.showSnackBar('error', message);
  }

  public showMessage(message: string): void {
    this.showSnackBar('success', message);
  }

  private showSnackBar(type: string, message: string): void {
    if (type === 'success') {
      this.toastrService.success(message, undefined, {
        progressAnimation: 'decreasing',
        progressBar: true,
      });
    }

    if (type === 'error') {
      this.toastrService.error(message, undefined, {
        progressAnimation: 'decreasing',
        progressBar: true,
      });
    }

    if (type === 'warning') {
      this.toastrService.warning(message, undefined, {
        progressAnimation: 'decreasing',
        progressBar: true,
      });
    }
  }
}
