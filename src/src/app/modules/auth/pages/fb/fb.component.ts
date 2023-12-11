import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../../core/services/login/login.service';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {Subscription} from 'rxjs';
import {messages} from '../../../../core/messages/auth.messages';

@Component({
  selector: 'auth-pages-fb',
  templateUrl: './fb.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FbComponent implements OnInit, OnDestroy {
  private route: ActivatedRoute;
  private loginService: LoginService;
  private authService: AuthService;
  private router: Router;
  private notificationService: NotificationService;
  private subscription: Subscription | undefined;

  public constructor(
    route: ActivatedRoute,
    loginService: LoginService,
    authService: AuthService,
    router: Router,
    notificationService: NotificationService
  ) {
    this.route = route;
    this.loginService = loginService;
    this.authService = authService;
    this.router = router;
    this.notificationService = notificationService;
  }

  public ngOnInit(): void {
    let authToken = this.route.snapshot.queryParams.code;
    if (authToken === undefined) {
      return;
    }
    this.subscription = this.loginService.loginViaFb(authToken).subscribe(data => {
      if (data.isCorrect) {
        this.authService.storeToken(data);
        this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
      } else {
        this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
        this.notificationService.showErrorMessage(messages.authenticationError);
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
