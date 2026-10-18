import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {authRoutes} from '../../../config/routes.config';
import {LoginRequest} from '../../requests/auth.request';
import {Tokens, TokensData, Url} from '../../models/auth';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class LoginService {

  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public login(loginRequest: LoginRequest): Observable<TokensData> {
    return this.httpClient.post<Tokens>(authRoutes.login, loginRequest).pipe(
      map<Tokens, TokensData>(tokens => AuthService.getRefreshTokenData(tokens)),
      catchError(() => of(AuthService.getEmptyRefreshTokenData()))
    );
  }

  public fbRedirect() {
    this.httpClient.get<Url>(authRoutes.fbRedirect).subscribe(data => window.location.href = data.url);
  }

  public loginViaFb(authToken: string): Observable<TokensData> {
    return this.httpClient.post<Tokens>(authRoutes.fbLogin, {authToken: authToken}).pipe(
      map<Tokens, TokensData>(tokens => AuthService.getRefreshTokenData(tokens)),
      catchError(() => of(AuthService.getEmptyRefreshTokenData()))
    );
  }
}
