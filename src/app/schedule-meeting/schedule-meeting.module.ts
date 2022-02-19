import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ScheduleMeetingRoutingModule } from './schedule-meeting-routing.module';
import { ScheduleMeetingComponent } from './schedule-meeting.component';


@NgModule({
  declarations: [ScheduleMeetingComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ScheduleMeetingRoutingModule
  ]
})
export class ScheduleMeetingModule { }
