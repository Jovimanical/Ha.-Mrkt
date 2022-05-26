import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRentPropertyComponent } from './user-rent-property.component';

describe('UserRentPropertyComponent', () => {
  let component: UserRentPropertyComponent;
  let fixture: ComponentFixture<UserRentPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRentPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRentPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
