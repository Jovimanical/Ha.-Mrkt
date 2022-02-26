import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutOptionStep3Component } from './checkout-option-step3.component';

describe('CheckoutOptionStep3Component', () => {
  let component: CheckoutOptionStep3Component;
  let fixture: ComponentFixture<CheckoutOptionStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutOptionStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutOptionStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
