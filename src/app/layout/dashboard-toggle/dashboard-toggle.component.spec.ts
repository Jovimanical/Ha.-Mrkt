import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardToggleComponent } from './dashboard-toggle.component';

describe('DashboardToggleComponent', () => {
  let component: DashboardToggleComponent;
  let fixture: ComponentFixture<DashboardToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
