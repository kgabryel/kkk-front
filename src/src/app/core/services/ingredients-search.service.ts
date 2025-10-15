import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { SearchServiceInterface } from './search-service.interface';

export interface Search {
  name: string;
  available: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class IngredientsSearchService implements SearchServiceInterface<Search> {
  private search: WritableSignal<Search> = signal<Search>({
    available: null,
    name: '',
  });

  public getState(): Signal<Search> {
    return this.search.asReadonly();
  }

  public searchIngredients(search: Search): void {
    this.search.set(search);
  }
}
