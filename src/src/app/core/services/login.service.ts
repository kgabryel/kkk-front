import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { Tokens, TokensData, Url } from '@/app/core/models/auth';
import type { LoginRequest } from '@/app/core/requests/auth.request';

import { authRoutes } from '@/app/config/routes.config';

import { AuthService } from './auth.service';

@Injectable()
export class LoginService {
  private httpClient: HttpClient = inject(HttpClient);

  public async fbRedirect(): Promise<void> {
    const data = await firstValueFrom(this.httpClient.get<Url>(authRoutes.fbRedirect));
    window.location.href = data.url;
  }

  public login(loginRequest: LoginRequest): Observable<TokensData> {
    return this.httpClient.post<Tokens>(authRoutes.login, loginRequest).pipe(
      map<Tokens, TokensData>((tokens: Tokens) => AuthService.getRefreshTokenData(tokens)),
      catchError(() => of(AuthService.getEmptyRefreshTokenData())),
    );
  }

  public loginViaFb(authToken: string): Observable<TokensData> {
    return this.httpClient.post<Tokens>(authRoutes.fbLogin, { authToken: authToken }).pipe(
      map<Tokens, TokensData>((tokens: Tokens) => AuthService.getRefreshTokenData(tokens)),
      catchError(() => of(AuthService.getEmptyRefreshTokenData())),
    );
  }
}
