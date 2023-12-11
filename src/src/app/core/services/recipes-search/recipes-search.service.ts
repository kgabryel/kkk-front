import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  name: string;
  favourite: boolean | null;
  toDo: boolean | null;
  hasLink: boolean | null;
  tags: number[];
  ingredients: number[];
  available: boolean | null;
}

@Injectable()
export class RecipesSearchService {

  private search: BehaviorSubject<Search>;

  public constructor() {
    this.search = new BehaviorSubject<Search>({
      name: '',
      favourite: null,
      toDo: null,
      hasLink: null,
      tags: [],
      ingredients: [],
      available: null
    });
  }

  public searchRecipe(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
