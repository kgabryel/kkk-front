import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { inject, signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

import { RoutingConfig } from '../../config/routing.config';
import { RefreshTokenData } from '../models/auth';
import { AuthService } from '../services/auth.service';
import { StoreService } from '../services/store.service';
import { PathUtils } from '../utils/path.utils';

let isRefreshing = false;
const refreshed: WritableSignal<boolean> = signal<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const storeService = inject(StoreService);

  if (request.url.includes('/api/refresh_token')) {
    return next(request);
  }
  const handle401 = (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshed.set(false);

      return authService.refreshToken().pipe(
        switchMap((tokens: RefreshTokenData) => {
          if (tokens?.isCorrect) {
            authService.storeToken(tokens);
            refreshed.set(true);

            return next(authService.addTokenToRequest(req));
          }

          return throwError(() => new Error('Invalid refresh'));
        }),
        catchError((err: unknown): Observable<never> => {
          AuthService.clearTokens(storeService);
          void router.navigate([PathUtils.concatPath(RoutingConfig.login)]);
          refreshed.set(false);

          return throwError(() => err);
        }),
        finalize(() => (isRefreshing = false)),
      );
    }

    return toObservable(refreshed).pipe(
      filter((refreshed: boolean) => refreshed),
      take(1),
      switchMap(() => next(authService.addTokenToRequest(req))),
    );
  };

  return next(request).pipe(
    catchError((err: unknown): Observable<HttpEvent<unknown>> => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return handle401(request);
      }

      return throwError(() => err);
    }),
  );
};
