import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermOfUseRoutingModule } from './term-of-use-routing.module';
import { TermOfUseComponent } from './term-of-use.component';


@NgModule({
  declarations: [TermOfUseComponent],
  imports: [
    CommonModule,
    TermOfUseRoutingModule
  ]
})
export class TermOfUseModule { }
