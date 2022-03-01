import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoiceLandRoutingModule } from './choice-land-routing.module';
import { ChoiceLandComponent } from './choice-land.component';


@NgModule({
  declarations: [ChoiceLandComponent],
  imports: [
    CommonModule,
    ChoiceLandRoutingModule
  ]
})
export class ChoiceLandModule { }
