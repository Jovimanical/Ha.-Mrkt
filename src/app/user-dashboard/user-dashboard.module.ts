import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Angular4PaystackModule } from 'angular4-paystack';
import { FlutterwaveModule } from "flutterwave-angular-v3"
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
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
import { UserEmploymentStatusComponent } from './user-employment-status/user-employment-status.component';
import { UserPersonalInfoComponent } from './user-personal-info/user-personal-info.component';
import { UserRequiredDocumentsComponent } from './user-required-documents/user-required-documents.component';
import { RegisterLandComponent } from './register-land/register-land.component';
import { RegisteredLandProcessComponent } from './registered-land-process/registered-land-process.component';
import { MyMortgageApplicationComponent } from './my-mortgage-application/my-mortgage-application.component';
import { MyLoanApplicationComponent } from './my-loan-application/my-loan-application.component';
import { SearchSubscriptionComponent } from './search-subscription/search-subscription.component';
import { UserRequiredAssetsComponent } from './user-required-assets/user-required-assets.component';
import { UserRequiredLiabilityComponent } from './user-required-liability/user-required-liability.component';
import { UserRequiredExtraIncomeComponent } from './user-required-extra-income/user-required-extra-income.component';
import { UserApplicationStatusComponent } from './user-application-status/user-application-status.component';
import { UserRentPropertyComponent } from './user-rent-property/user-rent-property.component';
import { UserLeasePropertyComponent } from './user-lease-property/user-lease-property.component';
import { UserTransferPropertyComponent } from './user-transfer-property/user-transfer-property.component';
import { UserResellPropertyComponent } from './user-resell-property/user-resell-property.component';
import { UserDigitalTitleComponent } from './user-digital-title/user-digital-title.component';


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
        LayoutModule,
        FlutterwaveModule,
        ChartsModule,
        Angular4PaystackModule.forRoot('pk_test_a153339870d0227aa490acb9d88fd220a90f02f2'),
    ],
    declarations: [
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
        UserEmploymentStatusComponent,
        UserPersonalInfoComponent,
        UserRequiredDocumentsComponent,
        RegisterLandComponent,
        RegisteredLandProcessComponent,
        MyMortgageApplicationComponent,
        MyLoanApplicationComponent,
        SearchSubscriptionComponent,
        UserRequiredAssetsComponent,
        UserRequiredLiabilityComponent,
        UserRequiredExtraIncomeComponent,
        UserApplicationStatusComponent,
        UserRentPropertyComponent,
        UserLeasePropertyComponent,
        UserTransferPropertyComponent,
        UserResellPropertyComponent,
        UserDigitalTitleComponent,
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserDashboardModule { }
