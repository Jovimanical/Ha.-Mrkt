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
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';

const storeRoutes: Routes = [
  { path: '', component: StoreComponent },
  { path: 'products/:id', component: ProductDetailComponent },
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
