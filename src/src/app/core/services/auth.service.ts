import type { HttpRequest } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import type { RefreshTokenData, Tokens } from '@/app/core/models/auth';
import type { ChangePasswordRequest, ResetPasswordRequest } from '@/app/core/requests/auth.request';

import { authRoutes } from '@/app/config/routes.config';

import { StoreService } from './store.service';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly storeService: StoreService = inject(StoreService);

  public static clearTokens(storeService: StoreService): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    storeService.clearStores();
  }

  public static getEmptyRefreshTokenData(): RefreshTokenData {
    return {
      isCorrect: false,
      refresh_token: '',
      token: '',
    };
  }

  public static getRefreshTokenData(tokens: Tokens): RefreshTokenData {
    return {
      isCorrect: true,
      refresh_token: tokens.refresh_token,
      token: tokens.token,
    };
  }

  public addTokenToRequest<T>(req: HttpRequest<T>): HttpRequest<T> {
    const token = this.getToken();

    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public changePassword(changePasswordRequest: ChangePasswordRequest, token: string): Observable<boolean> {
    return this.httpClient.post<null>(authRoutes.changePassword(token), changePasswordRequest).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  public checkToken(token: string): Observable<boolean> {
    return this.httpClient.get<null>(authRoutes.checkToken(token), {}).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  public getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN) ?? '';
  }

  public isLogged(): Observable<boolean> {
    return this.checkAccessToken().pipe(
      mergeMap((data: boolean) => {
        if (data) {
          return of(data);
        }

        return this.refreshToken().pipe(
          mergeMap((tokens: RefreshTokenData) => {
            if (!tokens.isCorrect) {
              return of(false);
            }
            this.storeToken({
              refresh_token: tokens.refresh_token,
              token: tokens.token,
            });

            return of(true);
          }),
        );
      }),
    );
  }

  public refreshToken(): Observable<RefreshTokenData> {
    return this.httpClient
      .post<Tokens>(authRoutes.refreshToken, {
        refresh_token: localStorage.getItem(REFRESH_TOKEN),
      })
      .pipe(
        map((tokens: Tokens): RefreshTokenData => AuthService.getRefreshTokenData(tokens)),
        catchError(() => of(AuthService.getEmptyRefreshTokenData())),
      );
  }

  public resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<boolean> {
    return this.httpClient.post<null>(authRoutes.resetPassword, resetPasswordRequest).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  public storeToken(tokens: Tokens): void {
    localStorage.setItem(ACCESS_TOKEN, tokens.token ?? '');
    localStorage.setItem(REFRESH_TOKEN, tokens.refresh_token ?? '');
  }

  private checkAccessToken(): Observable<boolean> {
    const jwtHelper = new JwtHelperService();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (accessToken === null) {
      AuthService.clearTokens(this.storeService);

      return of(false);
    }
    let tokenDate: Date;

    try {
      tokenDate = jwtHelper.getTokenExpirationDate(accessToken) ?? new Date();
    } catch {
      return of(false);
    }

    return of(tokenDate > new Date());
  }
}
