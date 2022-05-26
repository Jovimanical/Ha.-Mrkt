import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard.component';
import { AuthGuardService } from 'app/authentication/auth-guard.service';
import { Role } from 'app/shared/models/role';
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
import { UserRequiredAssetsComponent } from './user-required-assets/user-required-assets.component';
import { UserRequiredLiabilityComponent } from './user-required-liability/user-required-liability.component';
import { UserRequiredExtraIncomeComponent } from './user-required-extra-income/user-required-extra-income.component';
import { UserApplicationStatusComponent } from './user-application-status/user-application-status.component';
import { UserRentPropertyComponent } from './user-rent-property/user-rent-property.component';
import { UserLeasePropertyComponent } from './user-lease-property/user-lease-property.component';
import { UserTransferPropertyComponent } from './user-transfer-property/user-transfer-property.component';
import { UserResellPropertyComponent } from './user-resell-property/user-resell-property.component';



// import { UserAdminComponent } from './user-admin/user-admin.component';
// import { InviteComponent } from './invite/invite.component';
// import { UserDetailsComponent } from './user-admin/user-details/user-details.component';
// import { OrderAdminComponent } from './order-admin/order-admin.component';
// import { OrderDetailsComponent } from './order-admin/order-details/order-details.component';

const userRoutes: Routes = [
    { path: '', component: UserDashboardComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-reviews', component: UserReviewsComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-transaction-history', component: UserTransactionHistoryComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-messaging', component: UserMessagingComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-properties', component: UserMyPropertiesComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-listings', component: UserListingsComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-referral', component: UserMyReferralComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-mortgage', component: UserMortgageComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-settings', component: UserMySettingsComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-bookings', component: UserBookingsComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-wallet', component: UserWalletComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-land-registry', component: UserLandRegistryComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-employment-status', component: UserEmploymentStatusComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-personal-information', component: UserPersonalInfoComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-required-documents', component: UserRequiredDocumentsComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-land-registeration', component: RegisterLandComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-land-resisteration-status', component: RegisteredLandProcessComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-mortgage-applications', component: MyMortgageApplicationComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-loan-applications', component: MyLoanApplicationComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-search-subscription', component: SearchSubscriptionComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-required-assets', component: UserRequiredAssetsComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-required-liability', component: UserRequiredLiabilityComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-required-extra-income', component: UserRequiredExtraIncomeComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-application-status/:id', component: UserApplicationStatusComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-rent-property/:id', component: UserRentPropertyComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-lease-property/:id', component: UserLeasePropertyComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-transfer-property/:id', component: UserTransferPropertyComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },
    { path: 'user-resell-property/:id', component: UserResellPropertyComponent, canActivate: [AuthGuardService], data: { roles: [Role.User] } },



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
