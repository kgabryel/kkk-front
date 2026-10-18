import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  ingredients: number[];
  months: number[];
}

@Injectable()
export class SeasonsSearchService {

  private search: BehaviorSubject<Search>;

  public constructor() {
    this.search = new BehaviorSubject<Search>({
      ingredients: [],
      months: []
    });
  }

  public searchSeason(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
