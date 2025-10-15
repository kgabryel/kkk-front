import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

import { SearchServiceInterface } from './search-service.interface';

export interface Search {
  ingredients: number[];
  months: number[];
}

@Injectable({ providedIn: 'root' })
export class SeasonsSearchService implements SearchServiceInterface<Search> {
  private search: WritableSignal<Search> = signal<Search>({
    ingredients: [],
    months: [],
  });

  public getState(): Signal<Search> {
    return this.search.asReadonly();
  }

  public searchSeason(search: Search): void {
    this.search.set(search);
  }
}
