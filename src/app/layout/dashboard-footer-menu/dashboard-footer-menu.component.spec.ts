import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFooterMenuComponent } from './dashboard-footer-menu.component';

describe('DashboardFooterMenuComponent', () => {
  let component: DashboardFooterMenuComponent;
  let fixture: ComponentFixture<DashboardFooterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFooterMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFooterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
