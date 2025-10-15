import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { RoutingConfig } from '../../../../config/routing.config';
import { messages } from '../../../../core/messages/auth.messages';
import { TokensData } from '../../../../core/models/auth';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginService } from '../../../../core/services/login.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PathUtils } from '../../../../core/utils/path.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'auth-pages-fb',
  standalone: true,
  styleUrls: [],
  templateUrl: './fb.component.html',
})
export class FbComponent implements OnInit {
  private authService: AuthService;
  private loginService: LoginService;
  private notificationService: NotificationService;
  private route: ActivatedRoute;
  private router: Router;
  public constructor(
    route: ActivatedRoute,
    loginService: LoginService,
    authService: AuthService,
    router: Router,
    notificationService: NotificationService,
  ) {
    this.route = route;
    this.loginService = loginService;
    this.authService = authService;
    this.router = router;
    this.notificationService = notificationService;
  }

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
