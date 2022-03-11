import { TestBed } from '@angular/core/testing';

import { EstateMapSidebarService } from './estate-map-sidebar.service';

describe('EstateMapSidebarService', () => {
  let service: EstateMapSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstateMapSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
