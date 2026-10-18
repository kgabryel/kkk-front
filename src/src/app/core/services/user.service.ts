import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { ApiKey } from '@/app/core/models/api-key';
import type { Settings } from '@/app/core/models/settings';
import type { ChangePasswordRequest } from '@/app/core/requests/change-password.request';

import { apiKeysRoutes, settingsRoutes } from '@/app/config/routes.config';

@Injectable({ providedIn: 'root' })
export class UserService {
  private httpClient: HttpClient = inject(HttpClient);

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
