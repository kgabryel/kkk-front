import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { timersRoutes } from '../../config/routes.config';
import { Timer } from '../models/timer';
import { TimerRequest } from '../requests/timer.request';

@Injectable()
export class TimersService {
  private httpClient: HttpClient;
  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public add(timer: TimerRequest): Observable<Timer> {
    return this.httpClient.post<Timer>(timersRoutes.index, timer);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<void>(timersRoutes.byId(id)).pipe(map(() => id));
  }

  public getAll(): Observable<Timer[]> {
    return this.httpClient.get<Timer[]>(timersRoutes.index);
  }

  public update(id: number, timer: TimerRequest): Observable<Timer> {
    return this.httpClient.put<Timer>(timersRoutes.byId(id), timer);
  }
}
