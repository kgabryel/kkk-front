import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {StoreService} from '../../../../core/services/store/store.service';
import {Router} from '@angular/router';

@Component({
  selector: 'account-logout-btn',
  templateUrl: './logout-btn.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutBtnComponent {

  private readonly storeService: StoreService;
  private router: Router;

  public constructor(router: Router, storeService: StoreService) {
    this.router = router;
    this.storeService = storeService;
  }

  public logout(): void {
    AuthService.clearTokens(this.storeService);
    this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
  }
}
