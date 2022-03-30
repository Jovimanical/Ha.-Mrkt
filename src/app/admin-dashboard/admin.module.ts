import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminRoutingModule } from './admin-routing.module';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { InviteComponent } from './invite/invite.component';
import { InviteService } from './invite/invite.service';
import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { LayoutModule } from 'app/layout/layout.module';
import { UserDetailsComponent } from './user-admin/user-details/user-details.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { OrderDetailsComponent } from './order-admin/order-details/order-details.component';
import { SystemListingsComponent } from './system-listings/system-listings.component';
import { SystemTransactionHistoryComponent } from './system-transaction-history/system-transaction-history.component';
import { SystemPersonalInformationComponent } from './system-personal-information/system-personal-information.component';
import { SystemEmploymentStatusComponent } from './system-employment-status/system-employment-status.component';
import { SystemRequiredDocumentsComponent } from './system-required-documents/system-required-documents.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    LayoutModule
  ],
  declarations: [
    UserAdminComponent,
    InviteComponent,
    AdminComponent,
    UserDetailsComponent,
    OrderAdminComponent,
    OrderDetailsComponent,
    SystemListingsComponent,
    SystemTransactionHistoryComponent,
    SystemPersonalInformationComponent,
    SystemEmploymentStatusComponent,
    SystemRequiredDocumentsComponent
  ],
  providers: [
    InviteService,
    AdminService
  ]
})
export class AdminModule { }
