import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {seasonsRoutes} from '../../../config/routes.config';
import {map} from 'rxjs/operators';
import {Season} from '../../models/season';
import {SeasonRequest, UpdateSeasonRequest} from '../../requests/season.request';

@Injectable()
export class SeasonsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Season[]> {
    return this.httpClient.get<Season[]>(seasonsRoutes.index);
  }

  public add(season: SeasonRequest): Observable<Season> {
    return this.httpClient.post<Season>(seasonsRoutes.index, season);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(seasonsRoutes.byId(id)).pipe(map(() => id));
  }

  public update(id: number, season: UpdateSeasonRequest): Observable<Season> {
    return this.httpClient.patch<Season>(seasonsRoutes.byId(id), season);
  }
}
