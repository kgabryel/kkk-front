import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Timer} from '../../models/timer';

@Injectable()
export class TimersListService {
  private timers: BehaviorSubject<Timer>;

  public constructor() {
    this.timers = new BehaviorSubject<Timer>({
      id: 0,
      time: 0,
      name: null
    });
  }

  public addTimer(timer: Timer): void {
    this.timers.next(timer);
  }

  public getState(): Observable<Timer> {
    return this.timers.asObservable();
  }
}
