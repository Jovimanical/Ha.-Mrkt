import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'app/layout/layout.module';
import { FAQsRoutingModule } from './faqs-routing.module';
import { FAQsComponent } from './faqs.component';


@NgModule({
  declarations: [FAQsComponent],
  imports: [
    CommonModule,
    FAQsRoutingModule
  ]
})
export class FAQsModule { }
