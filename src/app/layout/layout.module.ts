import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    AuthenticationModule,
    SharedModule,
    NotificationsModule,
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
    DashboardFooterMenuComponent
  ],
  exports: [ShellComponent, DashboardMenuStatusComponent, DashboardFooterMenuComponent, SidebarComponent]
})
export class LayoutModule { }
