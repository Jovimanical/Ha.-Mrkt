import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { InviteComponent } from './invite/invite.component';
import { AdminComponent } from './admin.component';
import { UserDetailsComponent } from './user-admin/user-details/user-details.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { OrderDetailsComponent } from './order-admin/order-details/order-details.component';
import { Role } from 'app/shared/models/role';

const adminRoutes: Routes = [
  { path: '', component: AdminComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
  { path: 'invite', component: InviteComponent },
  { path: 'users', component: UserAdminComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'orders', component: OrderAdminComponent },
  { path: 'orders/:id', component: OrderDetailsComponent }
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
