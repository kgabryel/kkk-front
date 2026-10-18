import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

import type { Season } from '@/app/core/models/season';
import type { SeasonRequest, UpdateSeasonRequest } from '@/app/core/requests/season.request';

import { seasonsRoutes } from '@/app/config/routes.config';

@Injectable()
export class SeasonsService {
  private httpClient: HttpClient = inject(HttpClient);

  public add(season: SeasonRequest): Observable<Season> {
    return this.httpClient.post<Season>(seasonsRoutes.index, season);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<void>(seasonsRoutes.byId(id)).pipe(map(() => id));
  }

  public getAll(): Observable<Season[]> {
    return this.httpClient.get<Season[]>(seasonsRoutes.index);
  }

  public update(id: number, season: UpdateSeasonRequest): Observable<Season> {
    return this.httpClient.patch<Season>(seasonsRoutes.byId(id), season);
  }
}
