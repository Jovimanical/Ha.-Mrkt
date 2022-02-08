import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMortgageComponent } from './user-mortgage.component';

describe('UserMortgageComponent', () => {
  let component: UserMortgageComponent;
  let fixture: ComponentFixture<UserMortgageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMortgageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
