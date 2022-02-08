import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuStatusComponent } from './dashboard-menu-status.component';

describe('DashboardMenuStatusComponent', () => {
  let component: DashboardMenuStatusComponent;
  let fixture: ComponentFixture<DashboardMenuStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
