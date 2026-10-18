import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {RefreshTokenData, Tokens} from '../../models/auth';
import {authRoutes} from '../../../config/routes.config';
import {StoreService} from '../store/store.service';
import {ChangePasswordRequest, ResetPasswordRequest} from '../../requests/auth.request';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable()
export class AuthService {

  private httpClient: HttpClient;
  private readonly storeService: StoreService;

  constructor(httpClient: HttpClient, storeService: StoreService) {
    this.httpClient = httpClient;
    this.storeService = storeService;
  }

  public static clearTokens(storeService: StoreService): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    storeService.clearStores();
  }

  public static getEmptyRefreshTokenData(): RefreshTokenData {
    return {
      token: '',
      refresh_token: '',
      isCorrect: false
    };
  }

  public static getRefreshTokenData(tokens: Tokens): RefreshTokenData {
    return {
      token: tokens.token,
      refresh_token: tokens.refresh_token,
      isCorrect: true
    };
  }

  public storeToken(tokens: Tokens): void {
    localStorage.setItem(ACCESS_TOKEN, tokens.token ?? '');
    localStorage.setItem(REFRESH_TOKEN, tokens.refresh_token ?? '');
  }

  public resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<boolean> {
    return this.httpClient.post<null>(authRoutes.resetPassword, resetPasswordRequest).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public changePassword(changePasswordRequest: ChangePasswordRequest, token: string): Observable<boolean> {
    return this.httpClient.post<null>(authRoutes.changePassword(token), changePasswordRequest).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public checkToken(token: string): Observable<boolean> {
    return this.httpClient.get<null>(authRoutes.checkToken(token), {}).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public isLogged(): Observable<boolean> {
    return this.checkAccessToken().pipe(mergeMap(data => {
      if (data) {
        return of(data);
      }
      return this.refreshToken().pipe(mergeMap(tokens => {
        if (!tokens.isCorrect) {
          return of(false);
        }
        this.storeToken({
          token: tokens.token,
          refresh_token: tokens.refresh_token
        });
        return of(true);
      }));
    }));
  }

  public refreshToken(): Observable<RefreshTokenData> {
    return this.httpClient.post<Tokens>(authRoutes.refreshToken, {
      refresh_token: localStorage.getItem(REFRESH_TOKEN)
    }).pipe(
      map<Tokens, RefreshTokenData>(tokens => AuthService.getRefreshTokenData(tokens)),
      catchError(() => of(AuthService.getEmptyRefreshTokenData()))
    );
  }

  public getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN) ?? '';
  }

  public addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.getToken();
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
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
    } catch (error) {
      return of(false);
    }
    return of(tokenDate > new Date());
  }
}
