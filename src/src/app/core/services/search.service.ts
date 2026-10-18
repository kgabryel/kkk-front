import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { RoutingConfig } from '../../config/routing.config';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private search: WritableSignal<boolean> = signal<boolean>(false);

  public static searchIsActive(url: string): boolean {
    const searchableUrl = [
      '/' + RoutingConfig.tags,
      '/' + RoutingConfig.ingredients,
      '/' + RoutingConfig.seasons,
      '/' + RoutingConfig.recipes,
    ];

    return searchableUrl.includes(url);
  }

  public getState(): Signal<boolean> {
    return this.search.asReadonly();
  }
  public updateSearch(state: boolean): void {
    this.search.set(state);
  }
}
