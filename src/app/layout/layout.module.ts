import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-img-cropper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SharedModule } from '../shared/shared.module';
import { NotificationsModule } from '../admin-dashboard/notifications/notifications.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShellComponent } from './shell.component';
import { ProfileIconComponent } from './header/profile-icon/profile-icon.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { CartIconComponent } from 'app/layout/header/cart-icon/cart-icon.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardMenuStatusComponent } from './dashboard-menu-status/dashboard-menu-status.component';
import { DashboardFooterMenuComponent } from './dashboard-footer-menu/dashboard-footer-menu.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { PageIsLoadingComponent } from './page-is-loading/page-is-loading.component';
import { DashboardToggleComponent } from './dashboard-toggle/dashboard-toggle.component';
import { StreetViewComponent } from './street-view/street-view.component';
import { AlertComponent } from './alert/alert.component'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    AuthenticationModule,
    SharedModule,
    NotificationsModule,
    ImageCropperModule,
    FlexLayoutModule
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ShellComponent,
    ProfileIconComponent,
    CartIconComponent,
    FooterComponent,
    DashboardMenuStatusComponent,
    DashboardFooterMenuComponent,
    EmptyStateComponent,
    ProfileImageComponent,
    PageIsLoadingComponent,
    DashboardToggleComponent,
    StreetViewComponent,
    AlertComponent
  ],
  exports: [
    ShellComponent,
    DashboardMenuStatusComponent,
    DashboardFooterMenuComponent,
    SidebarComponent,
    EmptyStateComponent,
    ProfileImageComponent,
    PageIsLoadingComponent,
    DashboardToggleComponent,
    FooterComponent,
    StreetViewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }
