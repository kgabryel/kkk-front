import type { OnInit } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import type { TokensData } from '@/app/core/models/auth';

import { RoutingConfig } from '@/app/config/routing.config';
import { messages } from '@/app/core/messages/auth.messages';
import { AuthService } from '@/app/core/services/auth.service';
import { LoginService } from '@/app/core/services/login.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { PathUtils } from '@/app/core/utils/path.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginService],
  selector: 'auth-pages-fb',
  templateUrl: './fb.component.html',
})
export class FbComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private loginService: LoginService = inject(LoginService);
  private notificationService: NotificationService = inject(NotificationService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  public ngOnInit(): void {
    const authToken = this.route.snapshot.queryParams['code'];

    if (authToken === undefined) {
      return;
    }
    this.loginService
      .loginViaFb(authToken)
      .pipe(take(1))
      .subscribe((data: TokensData) => {
        if (data.isCorrect) {
          this.authService.storeToken(data);
          void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
        } else {
          void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
          this.notificationService.showErrorMessage(messages.authenticationError);
        }
      });
  }
}
