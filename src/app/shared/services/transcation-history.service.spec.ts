import { TestBed } from '@angular/core/testing';

import { TranscationHistoryService } from './transcation-history.service';

describe('TranscationHistoryService', () => {
  let service: TranscationHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranscationHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
