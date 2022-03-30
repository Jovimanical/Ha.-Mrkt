import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemEmploymentStatusComponent } from './system-employment-status.component';

describe('SystemEmploymentStatusComponent', () => {
  let component: SystemEmploymentStatusComponent;
  let fixture: ComponentFixture<SystemEmploymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemEmploymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemEmploymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
