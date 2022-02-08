import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewPropertyComponent } from './user-view-property.component';

describe('UserViewPropertyComponent', () => {
  let component: UserViewPropertyComponent;
  let fixture: ComponentFixture<UserViewPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserViewPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
