import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-img-cropper';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SharedModule } from '../shared/shared.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ShellComponent } from './shell.component';
import { ProfileIconComponent } from './header/profile-icon/profile-icon.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CartIconComponent } from 'app/layout/header/cart-icon/cart-icon.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from './footer/footer.component';
import { DashboardMenuStatusComponent } from './dashboard-menu-status/dashboard-menu-status.component';
import { DashboardFooterMenuComponent } from './dashboard-footer-menu/dashboard-footer-menu.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { PageIsLoadingComponent } from './page-is-loading/page-is-loading.component';

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
    PageIsLoadingComponent
  ],
  exports: [ShellComponent, DashboardMenuStatusComponent, DashboardFooterMenuComponent, SidebarComponent, EmptyStateComponent,
    ProfileImageComponent, PageIsLoadingComponent]
})
export class LayoutModule { }
