import { TestBed } from '@angular/core/testing';

import { LocalForageService } from './localforage.service';

describe('LocalForageService', () => {
  let service: LocalForageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalForageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
