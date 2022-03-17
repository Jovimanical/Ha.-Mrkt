import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'app/layout/layout.module';
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
