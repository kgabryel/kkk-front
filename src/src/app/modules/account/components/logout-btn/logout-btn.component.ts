import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

import { RoutingConfig } from '@/app/config/routing.config';
import { AuthService } from '@/app/core/services/auth.service';
import { StoreService } from '@/app/core/services/store.service';
import { PathUtils } from '@/app/core/utils/path.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton],
  selector: 'account-logout-btn',
  templateUrl: './logout-btn.component.html',
})
export class LogoutBtnComponent {
  private router: Router = inject(Router);
  private readonly storeService: StoreService = inject(StoreService);

  public logout(): void {
    AuthService.clearTokens(this.storeService);
    void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
  }
}
