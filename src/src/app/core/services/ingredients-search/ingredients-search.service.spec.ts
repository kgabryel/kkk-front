import {TestBed} from '@angular/core/testing';

import {IngredientsSearchService} from './ingredients-search.service';

describe('IngredientsSearchService', () => {
  let service: IngredientsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
