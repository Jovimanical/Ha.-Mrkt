import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'app/layout/layout.module';
import { HelpCenterRoutingModule } from './help-center-routing.module';
import { HelpCenterComponent } from './help-center.component';



@NgModule({
  declarations: [HelpCenterComponent],
  imports: [
    CommonModule,
    HelpCenterRoutingModule
  ]
})
export class HelpCenterModule { }
