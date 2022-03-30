import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { Role } from 'app/shared/models/role';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { InviteComponent } from './invite/invite.component';
import { AdminComponent } from './admin.component';
import { UserDetailsComponent } from './user-admin/user-details/user-details.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { OrderDetailsComponent } from './order-admin/order-details/order-details.component';
import { SystemListingsComponent } from './system-listings/system-listings.component';
import { SystemTransactionHistoryComponent } from './system-transaction-history/system-transaction-history.component';
import { SystemPersonalInformationComponent } from './system-personal-information/system-personal-information.component';
import { SystemEmploymentStatusComponent } from './system-employment-status/system-employment-status.component';
import { SystemRequiredDocumentsComponent } from './system-required-documents/system-required-documents.component';



const adminRoutes: Routes = [
  { path: '', component: AdminComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'invite', component: InviteComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'users', component: UserAdminComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'users/:id', component: UserDetailsComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'orders', component: OrderAdminComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'orders/:id', component: OrderDetailsComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'system-listings', component: SystemListingsComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'system-transaction-history', component: SystemTransactionHistoryComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'system-personal-information', component: SystemPersonalInformationComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'system-employment-status', component: SystemEmploymentStatusComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'system-required-documents', component: SystemRequiredDocumentsComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
