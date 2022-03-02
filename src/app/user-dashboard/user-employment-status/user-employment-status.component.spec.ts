import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmploymentStatusComponent } from './user-employment-status.component';

describe('UserEmploymentStatusComponent', () => {
  let component: UserEmploymentStatusComponent;
  let fixture: ComponentFixture<UserEmploymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEmploymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEmploymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
