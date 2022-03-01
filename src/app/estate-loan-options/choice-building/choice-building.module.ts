import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoiceBuildingRoutingModule } from './choice-building-routing.module';
import { ChoiceBuildingComponent } from './choice-building.component';


@NgModule({
  declarations: [ChoiceBuildingComponent],
  imports: [
    CommonModule,
    ChoiceBuildingRoutingModule
  ]
})
export class ChoiceBuildingModule { }
