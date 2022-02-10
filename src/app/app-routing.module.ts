import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './authentication/auth-guard.service';


const appRoutes: Routes = [
  { path: '', redirectTo: '/store', pathMatch: 'full' },
 // { path: '**', redirectTo: '/page-not-found', pathMatch: 'full', },
  { path: 'store', loadChildren: () => import('app/store/store.module').then(m => m.StoreModule) },
  { path: 'store-map-view', loadChildren: () => import('./store/store-maplayout/store-maplayout.module').then(m => m.StoreMaplayoutModule) },
  { path: 'admin', loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuardService] },
  { path: 'user-dashboard', loadChildren: () => import('app/user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule), canActivate: [AuthGuardService] },
  { path: 'profile', loadChildren: () => import('app/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuardService] },
  { path: 'about-us', loadChildren: () => import('app/about-us/about-us.module').then(m => m.AboutUsModule) },
  { path: 'orders', loadChildren: () => import('app/orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuardService] },
  {
    path: 'contact-us',
    loadChildren: () => import('app/contact-us/contact-us.module').then(m => m.ContactUsModule)
  },
  { path: 'faqs', loadChildren: () => import('./faqs/faqs.module').then(m => m.FAQsModule) },
  { path: 'help-center', loadChildren: () => import('./help-center/help-center.module').then(m => m.HelpCenterModule) },
  { path: 'terms-of-use', loadChildren: () => import('./term-of-use/term-of-use.module').then(m => m.TermOfUseModule) },
  { path: 'privacy-policy', loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  { path: 'page-not-found', loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },
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
