import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyPropertiesComponent } from './user-my-properties.component';

describe('UserMyPropertiesComponent', () => {
  let component: UserMyPropertiesComponent;
  let fixture: ComponentFixture<UserMyPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMyPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
