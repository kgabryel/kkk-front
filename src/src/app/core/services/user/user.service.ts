import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Settings} from '../../models/settings';
import {apiKeysRoutes, settingsRoutes} from '../../../config/routes.config';
import {ApiKey} from '../../models/api-key';
import {catchError, map} from 'rxjs/operators';
import {ChangePasswordRequest} from '../../requests/change-password.request';

@Injectable()
export class UserService {

  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public loadSettings(): Observable<Settings> {
    return this.httpClient.get<Settings>(settingsRoutes.index);
  }

  public switchAutocomplete(): Observable<Settings> {
    return this.httpClient.patch<Settings>(settingsRoutes.switchAutocomplete, null);
  }

  public changeOzaKey(key: string | null): Observable<Settings> {
    return this.httpClient.patch<Settings>(settingsRoutes.changeOzaKey, {key});
  }

  public loadApiKeys(): Observable<ApiKey[]> {
    return this.httpClient.get<ApiKey[]>(apiKeysRoutes.index);
  }

  public generateKey(): Observable<ApiKey> {
    return this.httpClient.post<ApiKey>(apiKeysRoutes.index, null);
  }

  public deleteKey(id: number): Observable<number> {
    return this.httpClient.delete<any>(apiKeysRoutes.byId(id)).pipe(map(() => id));
  }

  public switchKeyActive(id: number): Observable<ApiKey> {
    return this.httpClient.patch<ApiKey>(apiKeysRoutes.byId(id), null);
  }

  public changePassword(data: ChangePasswordRequest): Observable<boolean> {
    return this.httpClient.post<null>(settingsRoutes.changePassword, data).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
