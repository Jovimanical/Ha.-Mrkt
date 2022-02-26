import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutChoiceMortgageComponent } from './checkout-choice-mortgage.component';

describe('CheckoutChoiceMortgageComponent', () => {
  let component: CheckoutChoiceMortgageComponent;
  let fixture: ComponentFixture<CheckoutChoiceMortgageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutChoiceMortgageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutChoiceMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
