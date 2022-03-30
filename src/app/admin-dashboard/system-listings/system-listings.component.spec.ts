import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemListingsComponent } from './system-listings.component';

describe('SystemListingsComponent', () => {
  let component: SystemListingsComponent;
  let fixture: ComponentFixture<SystemListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
