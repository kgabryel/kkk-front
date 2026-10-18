import {TestBed} from '@angular/core/testing';

import {SeasonsSearchService} from './seasons-search.service';

describe('SeasonsSearchService', () => {
  let service: SeasonsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
