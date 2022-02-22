import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlutterwaveModule } from "flutterwave-angular-v3"
import { Angular4PaystackModule } from 'angular4-paystack';
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
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';
import { MarketPlaceSearchComponent } from './market-place-search/market-place-search.component';

const storeRoutes: Routes = [
  { path: '', component: StoreComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'land-listing', component: LandOnlyListingComponent },
  { path: 'building-listing', component: BuildingOnlyListingComponent },
  { path: 'compare-listing', component: CompareListingsComponent },
  { path: 'search', component: MarketPlaceSearchComponent },
  { path: 'marketplace/:estate/unit/:id', component: ProductBlockListingComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardService] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService] },
  { path: 'checkout/confirmation', component: CheckoutConfirmationComponent, canActivate: [AuthGuardService] },
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
