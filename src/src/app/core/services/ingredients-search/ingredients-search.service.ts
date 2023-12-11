import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  name: string;
  available: boolean | null;
}

@Injectable()
export class IngredientsSearchService {

  private search: BehaviorSubject<Search>;

  public constructor() {
    this.search = new BehaviorSubject<Search>({
      name: '',
      available: null
    });
  }

  public searchIngredients(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
