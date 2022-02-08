import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { StoreMaplayoutRoutingModule } from './store-maplayout-routing.module';
import { StoreMaplayoutComponent } from './store-maplayout.component';


@NgModule({
  declarations: [StoreMaplayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule,
    StoreMaplayoutRoutingModule
  ]
})
export class StoreMaplayoutModule { }
