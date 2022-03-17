import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlutterwaveModule } from "flutterwave-angular-v3"
import { Angular4PaystackModule } from 'angular4-paystack';
import { NgWizardComponent } from '@cmdap/ng-wizard';
import { StoreComponent } from './store.component';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthGuardService } from '../authentication/auth-guard.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductBlockListingComponent } from './product-block-listing/product-block-listing.component';
import { LandOnlyListingComponent } from './land-only-listing/land-only-listing.component';
import { BuildingOnlyListingComponent } from './building-only-listing/building-only-listing.component';
import { CompareListingsComponent } from './compare-listings/compare-listings.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutChoiceLoanComponent } from './checkout-choice-loan/checkout-choice-loan.component';
import { CheckoutChoiceMortgageComponent } from './checkout-choice-mortgage/checkout-choice-mortgage.component';
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';
import { MarketPlaceSearchComponent } from './market-place-search/market-place-search.component';
import { CheckoutOptionStep2Component } from './checkout-option-step2/checkout-option-step2.component';
import { CheckoutOptionStep3Component } from './checkout-option-step3/checkout-option-step3.component';
import { CheckoutProcessOrderComponent } from './checkout-process-order/checkout-process-order.component';

const wizardConfig = {
  name: 'LoanWizard',
  navBar: {
    icons: {
      previous: '<i class="material-icons ng-wizard-icon">cake</i>',
      current: '<i class="material-icons ng-wizard-icon">star</i>',
      next: '<i class="material-icons ng-wizard-icon">pool</i>',
    },
  },
};

const storeRoutes: Routes = [
  { path: '', component: StoreComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'land-listing', component: LandOnlyListingComponent },
  { path: 'building-listing', component: BuildingOnlyListingComponent },
  { path: 'compare-listing', component: CompareListingsComponent },
  { path: 'search', component: MarketPlaceSearchComponent },
  { path: 'marketplace/:estate/unit/:id', component: ProductBlockListingComponent },
  { path: 'application', component: CartComponent, canActivate: [AuthGuardService] },
  {
    path: 'checkout-option-loan', component: NgWizardComponent, canActivate: [AuthGuardService], children: [
      { path: 'personal-information', component: CheckoutChoiceLoanComponent },
      { path: 'employment-information', component: CheckoutOptionStep2Component },
      { path: 'required-documents', component: CheckoutOptionStep3Component },
      { path: 'process-order', component: CheckoutProcessOrderComponent },
      { path: '**', redirectTo: 'personal-information' },
    ], data: { name: 'LoanWizard' }
  },
  { path: 'checkout-option-mortgage/:id', component: CheckoutChoiceMortgageComponent, canActivate: [AuthGuardService] },
  { path: 'checkout/:id', component: CheckoutComponent, canActivate: [AuthGuardService] },
  { path: 'checkout/confirmation/:id', component: CheckoutConfirmationComponent, canActivate: [AuthGuardService] },
];


@NgModule({
  imports: [
    CommonModule,
    FlutterwaveModule,
    AuthenticationModule,
    RouterModule.forChild(storeRoutes),
    Angular4PaystackModule.forRoot('pk_test_xxxxxxxxxxxxxxxxxxxxxxxx'),
  ],
  declarations: []
})
export class StoreRoutingModule { }
