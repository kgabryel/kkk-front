import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { authRoutes } from '../../config/routes.config';
import { Tokens, TokensData, Url } from '../models/auth';
import { LoginRequest } from '../requests/auth.request';
import { AuthService } from './auth.service';

@Injectable()
export class LoginService {
  private httpClient: HttpClient;
  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

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
