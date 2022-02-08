import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyReferralComponent } from './user-my-referral.component';

describe('UserMyReferralComponent', () => {
  let component: UserMyReferralComponent;
  let fixture: ComponentFixture<UserMyReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMyReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
