import { Signal } from '@angular/core';

export interface SearchServiceInterface<T> {
  getState(): Signal<T>;
}
