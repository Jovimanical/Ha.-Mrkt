import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard.component';
import { UserTransactionHistoryComponent } from './user-transaction-history/user-transaction-history.component';
import { UserMyPropertiesComponent } from './user-my-properties/user-my-properties.component';
import { UserMyReferralComponent } from './user-my-referral/user-my-referral.component';
import { UserMySettingsComponent } from './user-my-settings/user-my-settings.component';
import { UserReviewsComponent } from './user-reviews/user-reviews.component';
import { UserMessagingComponent } from './user-messaging/user-messaging.component';
import { UserListingsComponent } from './user-listings/user-listings.component';
import { UserMortgageComponent } from './user-mortgage/user-mortgage.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserWalletComponent } from './user-wallet/user-wallet.component';
import { UserLandRegistryComponent } from './user-land-registry/user-land-registry.component';
import { UserEmploymentStatusComponent } from './user-employment-status/user-employment-status.component';
import { UserPersonalInfoComponent } from './user-personal-info/user-personal-info.component';
import { UserRequiredDocumentsComponent } from './user-required-documents/user-required-documents.component';
import { RegisterLandComponent } from './register-land/register-land.component';
import { RegisteredLandProcessComponent } from './registered-land-process/registered-land-process.component';
import { MyMortgageApplicationComponent } from './my-mortgage-application/my-mortgage-application.component';
import { MyLoanApplicationComponent } from './my-loan-application/my-loan-application.component';
import { SearchSubscriptionComponent } from './search-subscription/search-subscription.component';
// import { UserAdminComponent } from './user-admin/user-admin.component';
// import { InviteComponent } from './invite/invite.component';
// import { UserDetailsComponent } from './user-admin/user-details/user-details.component';
// import { OrderAdminComponent } from './order-admin/order-admin.component';
// import { OrderDetailsComponent } from './order-admin/order-details/order-details.component';

const userRoutes: Routes = [
    { path: '', component: UserDashboardComponent },
    { path: 'user-reviews', component: UserReviewsComponent },
    { path: 'user-transaction-history', component: UserTransactionHistoryComponent },
    { path: 'user-messaging', component: UserMessagingComponent },
    { path: 'user-properties', component: UserMyPropertiesComponent },
    { path: 'user-listings', component: UserListingsComponent },
    { path: 'user-referral', component: UserMyReferralComponent },
    { path: 'user-mortgage', component: UserMortgageComponent },
    { path: 'user-settings', component: UserMySettingsComponent },
    { path: 'user-bookings', component: UserBookingsComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'user-wallet', component: UserWalletComponent },
    { path: 'user-land-registry', component: UserLandRegistryComponent },
    { path: 'user-employment-status', component: UserEmploymentStatusComponent },
    { path: 'user-personal-information', component: UserPersonalInfoComponent },
    { path: 'user-required-documents', component: UserRequiredDocumentsComponent },
    { path: 'user-land-registeration', component: RegisterLandComponent },
    { path: 'user-land-resisteration-status', component: RegisteredLandProcessComponent },
    { path: 'user-mortgage-applications', component: MyMortgageApplicationComponent },
    { path: 'user-loan-applications', component: MyLoanApplicationComponent },
    { path: 'user-search-subscription', component: SearchSubscriptionComponent },


    //   { path: 'invite', component: InviteComponent },
    //   { path: 'users', component: UserAdminComponent },
    //   { path: 'users/:id', component: UserDetailsComponent },
    //   { path: 'orders', component: OrderAdminComponent },
    //   { path: 'orders/:id', component: OrderDetailsComponent }
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(userRoutes)
    ],
    declarations: [],
    exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
