import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatNativeSelectModule } from '@ngx-formly/material/native-select';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { NgWizardModule } from '@cmdap/ng-wizard';
import { ArchwizardModule } from 'angular-archwizard';
import { OverlayModule } from '@angular/cdk/overlay';
import { SharedModule } from 'app/shared/shared.module';
import { StoreComponent } from './store.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { RouterModule } from '@angular/router';
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';
import { ProductBlockListingComponent } from './product-block-listing/product-block-listing.component';
import { LandOnlyListingComponent } from './land-only-listing/land-only-listing.component';
import { BuildingOnlyListingComponent } from './building-only-listing/building-only-listing.component';
import { CompareListingsComponent } from './compare-listings/compare-listings.component';
import { MarketPlaceSearchComponent } from './market-place-search/market-place-search.component';
import { CheckoutChoiceLoanComponent } from './checkout-choice-loan/checkout-choice-loan.component';
import { CheckoutChoiceMortgageComponent } from './checkout-choice-mortgage/checkout-choice-mortgage.component';
import { FileValueAccessor } from './file-value-accessor';
import { FormlyFieldFile } from './file-type.component';
import { FormlyFieldButton } from './button-type.component';
import { CheckoutOptionStep2Component } from './checkout-option-step2/checkout-option-step2.component';
import { CheckoutOptionStep3Component } from './checkout-option-step3/checkout-option-step3.component';
import { CheckoutProcessOrderComponent } from './checkout-process-order/checkout-process-order.component';
import { EstateMapSidebarService } from 'app/layout/estate-map-sidebar/estate-map-sidebar.service';
import { EstateMapSidebarComponent } from 'app/layout/estate-map-sidebar/estate-map-sidebar.component';

export function dateFutureValidator(control: FormControl, field: FormlyFieldConfig, options = {}): ValidationErrors {
  return { 'date-future': { message: `Validator options: ${JSON.stringify(options)}` } };
}

export function minlengthValidationMessage(err, field) {
  return `Should have atleast ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    StoreRoutingModule,
    FlexLayoutModule,
    SharedModule,
    FormlyMaterialModule,
    NgWizardModule,
    ArchwizardModule,
    OverlayModule,
    FormlyModule.forRoot({
      types: [
        { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] },
        {
          name: 'button',
          component: FormlyFieldButton,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              btnType: 'default',
              type: 'button',
            },
          },
        }
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minlength', message: minlengthValidationMessage },
        { name: 'maxlength', message: maxlengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
      ],
      validators: [
        {
          name: 'date-future',
          validation: dateFutureValidator,
          options: { days: 2 },
        },
      ],
    }),
    FormlyMatDatepickerModule,
    FormlyMatNativeSelectModule,
    FormlyMatToggleModule
  ],
  declarations: [
    StoreComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    CheckoutConfirmationComponent,
    ProductBlockListingComponent,
    LandOnlyListingComponent,
    BuildingOnlyListingComponent,
    CompareListingsComponent,
    MarketPlaceSearchComponent,
    CheckoutChoiceLoanComponent,
    CheckoutChoiceMortgageComponent,
    FileValueAccessor,
    FormlyFieldFile,
    CheckoutOptionStep2Component,
    CheckoutOptionStep3Component,
    CheckoutProcessOrderComponent,
    FormlyFieldButton,
    EstateMapSidebarComponent
  ],
  providers: [CurrencyPipe, EstateMapSidebarService],
  entryComponents: [EstateMapSidebarComponent],
  exports: [
    ProductDetailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoreModule { }
