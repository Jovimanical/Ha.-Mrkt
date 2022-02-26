import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutChoiceLoanComponent } from './checkout-choice-loan.component';

describe('CheckoutChoiceLoanComponent', () => {
  let component: CheckoutChoiceLoanComponent;
  let fixture: ComponentFixture<CheckoutChoiceLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutChoiceLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutChoiceLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
