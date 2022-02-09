import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardService } from './users-dashboard.service';
import { UserTransactionHistoryComponent } from './user-transaction-history/user-transaction-history.component';
import { UserMyPropertiesComponent } from './user-my-properties/user-my-properties.component';
import { UserMySettingsComponent } from './user-my-settings/user-my-settings.component';
import { UserMyReferralComponent } from './user-my-referral/user-my-referral.component';
import { UserMessagingComponent } from './user-messaging/user-messaging.component';
import { UserReviewsComponent } from './user-reviews/user-reviews.component';
import { UserMortgageComponent } from './user-mortgage/user-mortgage.component';
import { UserListingsComponent } from './user-listings/user-listings.component';
import { UserViewPropertyComponent } from './user-view-property/user-view-property.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserWalletComponent } from './user-wallet/user-wallet.component';
import { LayoutModule } from 'app/layout/layout.module';
import { UserLandRegistryComponent } from './user-land-registry/user-land-registry.component';
// import { InviteComponent } from './invite/invite.component';
// import { InviteService } from './invite/invite.service';
// import { UserDetailsComponent } from './user-admin/user-details/user-details.component';
// import { OrderAdminComponent } from './order-admin/order-admin.component';
// import { OrderDetailsComponent } from './order-admin/order-details/order-details.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserDashboardRoutingModule,
        AngularMaterialModule,
        FlexLayoutModule,
        FormsModule,
        LayoutModule
    ],
    declarations: [
        // DashboardMenuStatusComponent,
        UserDashboardComponent,
        UserTransactionHistoryComponent,
        UserMyPropertiesComponent,
        UserMySettingsComponent,
        UserMyReferralComponent,
        UserMessagingComponent,
        UserReviewsComponent,
        UserMortgageComponent,
        UserListingsComponent,
        UserViewPropertyComponent,
        UserBookingsComponent,
        UserProfileComponent,
        UserWalletComponent,
        UserLandRegistryComponent,
        // InviteComponent,
        //     UserDetailsComponent,
        //     OrderAdminComponent,
        //     OrderDetailsComponent
    ],
    providers: [
        // InviteService,
        UserDashboardService
    ],
    exports: [],
    schemas: []
})
export class UserDashboardModule { }
