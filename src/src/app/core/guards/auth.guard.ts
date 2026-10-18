import type { CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { RoutingConfig } from '@/app/config/routing.config';
import { AuthService } from '@/app/core/services/auth.service';
import { PathUtils } from '@/app/core/utils/path.utils';

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
