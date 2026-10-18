import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

import type { Timer } from '@/app/core/models/timer';
import type { TimerRequest } from '@/app/core/requests/timer.request';

import { timersRoutes } from '@/app/config/routes.config';

@Injectable()
export class TimersService {
  private httpClient: HttpClient = inject(HttpClient);

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
