import { Component, OnInit } from '@angular/core';
import { NgWizardStep } from '@cmdap/ng-wizard';

@Component({
  selector: 'app-checkout-process-order',
  templateUrl: './checkout-process-order.component.html',
  styleUrls: ['./checkout-process-order.component.scss']
})
export class CheckoutProcessOrderComponent extends NgWizardStep implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {

  }

  submit() {

  }

}
