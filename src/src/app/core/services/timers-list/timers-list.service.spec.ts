import {TestBed} from '@angular/core/testing';

import {TimersListService} from './timers-list.service';

describe('TimersListService', () => {
  let service: TimersListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimersListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
