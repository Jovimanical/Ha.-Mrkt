import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageCropperModule } from 'ngx-img-cropper';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { LayoutModule } from 'app/layout/layout.module';
/* This is a routing module that contains the routes for the profile page. */
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    ProfileRoutingModule,
    ImageCropperModule,
    SharedModule,
    LayoutModule
  ],
  declarations: [
    ProfileComponent,   
  ],
  exports: [],
  providers: []
})
export class ProfileModule { }
