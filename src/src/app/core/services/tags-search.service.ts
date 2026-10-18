import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { SearchServiceInterface } from './search-service.interface';

@Injectable({ providedIn: 'root' })
export class TagsSearchService implements SearchServiceInterface<string> {
  private search: WritableSignal<string> = signal<string>('');

  public getState(): Signal<string> {
    return this.search.asReadonly();
  }

  public searchTag(search: string): void {
    this.search.set(search);
  }
}
