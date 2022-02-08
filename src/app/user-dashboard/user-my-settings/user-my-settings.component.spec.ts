import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMySettingsComponent } from './user-my-settings.component';

describe('UserMySettingsComponent', () => {
  let component: UserMySettingsComponent;
  let fixture: ComponentFixture<UserMySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
