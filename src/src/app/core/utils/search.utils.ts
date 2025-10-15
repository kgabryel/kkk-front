import { computed, Signal } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';

import { SearchServiceInterface } from '../services/search-service.interface';

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
