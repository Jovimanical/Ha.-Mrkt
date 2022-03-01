import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstateLoanOptionsRoutingModule } from './estate-loan-options-routing.module';
import { EstateLoanOptionsComponent } from './estate-loan-options.component';


@NgModule({
  declarations: [EstateLoanOptionsComponent],
  imports: [
    CommonModule,
    EstateLoanOptionsRoutingModule
  ]
})
export class EstateLoanOptionsModule { }
