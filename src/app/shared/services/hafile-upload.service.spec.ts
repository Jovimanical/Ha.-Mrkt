import { TestBed } from '@angular/core/testing';

import { HAFileUploadService } from './hafile-upload.service';

describe('HAFileUploadService', () => {
  let service: HAFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HAFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
