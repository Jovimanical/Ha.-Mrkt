import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutrightPaymentComponent } from './check-outright-payment.component';

describe('CheckOutrightPaymentComponent', () => {
  let component: CheckOutrightPaymentComponent;
  let fixture: ComponentFixture<CheckOutrightPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutrightPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutrightPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
