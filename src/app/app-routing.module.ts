import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './authentication/auth-guard.service';
import { Role } from './shared/models/role';


const appRoutes: Routes = [
  { path: '', redirectTo: '/listings', pathMatch: 'full' },
 // { path: '**', redirectTo: '/page-not-found', pathMatch: 'full', },
  { path: 'listings', loadChildren: () => import('app/store/store.module').then(m => m.StoreModule) },
  { path: 'store-map-view', loadChildren: () => import('./store/store-maplayout/store-maplayout.module').then(m => m.StoreMaplayoutModule) },
  { path: 'admin-dashboard', loadChildren: () => import('app/admin-dashboard/admin.module').then(m => m.AdminModule), canActivate: [AuthGuardService] },
  { path: 'user-dashboard', loadChildren: () => import('app/user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule), canActivate: [AuthGuardService] },
  { path: 'site-pages', loadChildren: () => import('app/website/website.module').then(m => m.WebsiteModule) },
  { path: 'orders', loadChildren: () => import('app/admin-dashboard/orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuardService] },
 
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
