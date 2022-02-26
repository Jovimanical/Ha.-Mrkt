import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutProcessOrderComponent } from './checkout-process-order.component';

describe('CheckoutProcessOrderComponent', () => {
  let component: CheckoutProcessOrderComponent;
  let fixture: ComponentFixture<CheckoutProcessOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutProcessOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProcessOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
