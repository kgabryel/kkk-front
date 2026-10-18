import type { Signal } from '@angular/core';
import type { MemoizedSelector, Store } from '@ngrx/store';

import { computed } from '@angular/core';

import type { SearchServiceInterface } from '@/app/core/services/search-service.interface';

export class SearchUtils {
  public static search<T, R, V>(
    searchService: SearchServiceInterface<T>,
    store: Store<V>,
    selectorFactory: (search: T) => MemoizedSelector<V, R[]>,
    transform?: (results: R[]) => R[],
  ): Signal<R[]> {
    return computed(() => {
      const search = searchService.getState();
      const results = store.selectSignal(selectorFactory(search()))();

      return transform ? transform(results) : results;
    });
  }
}
