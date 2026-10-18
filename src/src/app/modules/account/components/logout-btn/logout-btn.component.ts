import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

import { RoutingConfig } from '../../../../config/routing.config';
import { AuthService } from '../../../../core/services/auth.service';
import { StoreService } from '../../../../core/services/store.service';
import { PathUtils } from '../../../../core/utils/path.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton],
  selector: 'account-logout-btn',
  standalone: true,
  styleUrls: [],
  templateUrl: './logout-btn.component.html',
})
export class LogoutBtnComponent {
  private router: Router;
  private readonly storeService: StoreService;
  public constructor(router: Router, storeService: StoreService) {
    this.router = router;
    this.storeService = storeService;
  }

  public logout(): void {
    AuthService.clearTokens(this.storeService);
    void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
  }
}
