import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { apiKeysRoutes, settingsRoutes } from '../../config/routes.config';
import { ApiKey } from '../models/api-key';
import { Settings } from '../models/settings';
import { ChangePasswordRequest } from '../requests/change-password.request';

@Injectable({ providedIn: 'root' })
export class UserService {
  private httpClient: HttpClient;
  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public changeOzaKey(key: string | null): Observable<Settings> {
    return this.httpClient.patch<Settings>(settingsRoutes.changeOzaKey, { key });
  }

  public changePassword(data: ChangePasswordRequest): Observable<boolean> {
    return this.httpClient.post<null>(settingsRoutes.changePassword, data).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  public deleteKey(id: number): Observable<number> {
    return this.httpClient.delete<void>(apiKeysRoutes.byId(id)).pipe(map(() => id));
  }

  public generateKey(): Observable<ApiKey> {
    return this.httpClient.post<ApiKey>(apiKeysRoutes.index, {});
  }

  public loadApiKeys(): Observable<ApiKey[]> {
    return this.httpClient.get<ApiKey[]>(apiKeysRoutes.index);
  }

  public loadSettings(): Observable<Settings> {
    return this.httpClient.get<Settings>(settingsRoutes.index);
  }

  public switchAutocomplete(): Observable<Settings> {
    return this.httpClient.patch<Settings>(settingsRoutes.switchAutocomplete, {});
  }

  public switchKeyActive(id: number): Observable<ApiKey> {
    return this.httpClient.patch<ApiKey>(apiKeysRoutes.byId(id), {});
  }
}
