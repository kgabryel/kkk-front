import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

import { SearchServiceInterface } from './search-service.interface';

export interface Search {
  name: string;
  favourite: boolean | null;
  toDo: boolean | null;
  hasLink: boolean | null;
  tags: number[];
  ingredients: number[];
  available: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class RecipesSearchService implements SearchServiceInterface<Search> {
  private search: WritableSignal<Search> = signal<Search>({
    available: null,
    favourite: null,
    hasLink: null,
    ingredients: [],
    name: '',
    tags: [],
    toDo: null,
  });

  public getState(): Signal<Search> {
    return this.search.asReadonly();
  }

  public searchRecipe(search: Search): void {
    this.search.set(search);
  }
}
