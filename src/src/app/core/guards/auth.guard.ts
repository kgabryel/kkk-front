import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { RoutingConfig } from '../../config/routing.config';
import { AuthService } from '../services/auth.service';
import { PathUtils } from '../utils/path.utils';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLogged().pipe(
    mergeMap((isLogged: boolean) => {
      if (isLogged) {
        return of(true);
      }
      void router.navigate([PathUtils.concatPath(RoutingConfig.login)]);

      return of(false);
    }),
  );
};
