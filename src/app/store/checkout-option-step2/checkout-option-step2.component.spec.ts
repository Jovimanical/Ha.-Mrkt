import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutOptionStep2Component } from './checkout-option-step2.component';

describe('CheckoutOptionStep2Component', () => {
  let component: CheckoutOptionStep2Component;
  let fixture: ComponentFixture<CheckoutOptionStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutOptionStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutOptionStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
