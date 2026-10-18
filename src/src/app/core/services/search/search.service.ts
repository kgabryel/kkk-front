import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {RoutingConfig} from '../../../config/routing.config';

@Injectable()
export class SearchService {

  private search: BehaviorSubject<boolean>;

  public constructor() {
    this.search = new BehaviorSubject<boolean>(false);
  }

  public static searchIsActive(url: string): boolean {
    const searchableUrl = [
      '/' + RoutingConfig.tags,
      '/' + RoutingConfig.ingredients,
      '/' + RoutingConfig.seasons,
      '/' + RoutingConfig.recipes
    ];
    return searchableUrl.includes(url);
  }

  public updateSearch(state: boolean): void {
    this.search.next(state);
  }

  public getState(): Observable<boolean> {
    return this.search.asObservable();
  }
}
