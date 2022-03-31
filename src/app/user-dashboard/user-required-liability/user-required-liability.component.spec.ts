import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequiredLiabilityComponent } from './user-required-liability.component';

describe('UserRequiredLiabilityComponent', () => {
  let component: UserRequiredLiabilityComponent;
  let fixture: ComponentFixture<UserRequiredLiabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequiredLiabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequiredLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
