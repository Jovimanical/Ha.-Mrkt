import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeasePropertyComponent } from './user-lease-property.component';

describe('UserLeasePropertyComponent', () => {
  let component: UserLeasePropertyComponent;
  let fixture: ComponentFixture<UserLeasePropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLeasePropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeasePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
