import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {mergeMap} from 'rxjs/operators';

type Result = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable()
export class AuthGuard implements CanActivate {
  private authService: AuthService;
  private router: Router;

  public constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Result {
    return this.authService.isLogged().pipe(mergeMap(result => {
      if (result) {
        return of(true);
      }
      this.router.navigate([PathUtils.concatPath(RoutingConfig.login)]);
      return of(false);
    }));
  }
}
