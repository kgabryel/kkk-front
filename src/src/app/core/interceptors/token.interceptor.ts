import type { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { inject } from '@angular/core';

import { AuthService } from '@/app/core/services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  return next(authService.addTokenToRequest(req));
};
