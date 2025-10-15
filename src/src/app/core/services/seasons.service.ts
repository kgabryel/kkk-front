import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { seasonsRoutes } from '../../config/routes.config';
import { Season } from '../models/season';
import { SeasonRequest, UpdateSeasonRequest } from '../requests/season.request';

@Injectable()
export class SeasonsService {
  private httpClient: HttpClient;
  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

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
