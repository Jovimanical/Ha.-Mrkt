import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequiredExtraIncomeComponent } from './user-required-extra-income.component';

describe('UserRequiredExtraIncomeComponent', () => {
  let component: UserRequiredExtraIncomeComponent;
  let fixture: ComponentFixture<UserRequiredExtraIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequiredExtraIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequiredExtraIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
