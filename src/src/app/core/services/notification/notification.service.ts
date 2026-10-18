import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {ToastrService} from 'ngx-toastr';
import {messages} from '../../messages/shared.messages';

@Injectable()
export class NotificationService {
  private toastrService: ToastrService;
  private router: Router;

  constructor(toastrService: ToastrService, router: Router) {
    this.toastrService = toastrService;
    this.router = router;
  }

  public showMessage(message: string): void {
    this.showSnackBar('success', message);
  }

  public showErrorMessage(message: string): void {
    this.showSnackBar('error', message);
  }

  public showError(error: number): void {
    if (error === 401) {
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
    } else if (error === 400 || error === 404 || error === 422) {
      this.showSnackBar('error', messages.invalidData);
    } else if (error >= 500) {
      this.showSnackBar('error', messages.serverError);
    }
  }

  private showSnackBar(type: string, message: string): void {
    if (type === 'success') {
      this.toastrService.success(message, undefined, {
        progressBar: true,
        progressAnimation: 'decreasing'
      });
    }

    if (type === 'error') {
      this.toastrService.error(message, undefined, {
        progressBar: true,
        progressAnimation: 'decreasing'
      });
    }

    if (type === 'warning') {
      this.toastrService.warning(message, undefined, {
        progressBar: true,
        progressAnimation: 'decreasing'
      });
    }
  }
}
