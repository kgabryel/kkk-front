import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Timer} from '../../models/timer';
import {timersRoutes} from '../../../config/routes.config';
import {map} from 'rxjs/operators';
import {TimerRequest} from '../../requests/timer.request';

@Injectable()
export class TimersService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Timer[]> {
    return this.httpClient.get<Timer[]>(timersRoutes.index);
  }

  public add(timer: TimerRequest): Observable<Timer> {
    return this.httpClient.post<Timer>(timersRoutes.index, timer);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(timersRoutes.byId(id)).pipe(map(() => id));
  }

  public update(id: number, timer: TimerRequest): Observable<Timer> {
    return this.httpClient.put<Timer>(timersRoutes.byId(id), timer);
  }
}
