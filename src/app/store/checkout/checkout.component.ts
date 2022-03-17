import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { User } from 'app/core/user/user.model';
import { StoreService } from 'app/shared/services/store.service';
import { Checkout } from 'app/shared/models/checkout.model';


declare var MonnifySDK: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;
  public balance = 0;
  public subtotal = 0;
  public numberOfProperties = 0
  public loading = true;
  public orderInfo: any = {};
  public cartProducts: Array<any> = [];
  public propertyID: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private notificationService: NotificationService,
    private userService: UserService,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute,
    public changeDectection: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.initializeForm(user.data);
    }, (error) => {

    });

    this.route.params.subscribe((params: any) => {
      this.propertyID = params['id'];


      this.storeService.fetchCartItem(params['id']).subscribe((response: any) => {
        console.log('response.data.records', response.data);
        if (response.data instanceof Object && Object.keys(response.data).length !== 0) {
          // save to loal store
          let cartItem = response.data
          this.subtotal += cartItem.PropertyAmount ? parseFloat(cartItem.PropertyAmount) : 0;
          this.balance += 3000
          this.numberOfProperties += 1
          cartItem.PropertyJson = JSON.parse(cartItem.PropertyJson);
          this.cartProducts.push(cartItem);

          // response.data.records.forEach((element: any) => {
          //   this.subtotal += element.PropertyAmount ? parseFloat(element.PropertyAmount) : 0;
          //   this.balance += 3000
          //   this.numberOfProperties += 1
          //   element.PropertyJson = JSON.parse(element.PropertyJson);
          //   this.cartProducts.push(element);
          // });

        } else {
          this.cartProducts = [];
        }
        this.loading = false;
        this.changeDectection.detectChanges();

      }, (error) => {
        this.loading = false;
        this.changeDectection.detectChanges();
      });

    });
    // this.broadcastService.balanceUpdated$
    //   .subscribe(balance => this.balance = balance);
  }

  checkout(): void {
    if (this.checkoutForm.invalid) {
      return;
    }

    this.loading = true;
    const model = this.checkoutForm.value as Checkout;


    // this.storeService.checkout(model).subscribe(result => {
    //   this.broadcastService.emitGetCart();
    //   this.broadcastService.emitGetBalance();
    //   this.router.navigate(['/listings/checkout/confirmation']);
    //   this.loading = false;
    // }, error => {
    //   this.notificationService.showErrorMessage(error.error[0].errorDescription);
    //   this.loading = false;
    // });

  }

  private initializeForm(user: User): void {
    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [user.email, Validators.required],
      mobile: [user.mobile, Validators.required],
      termsChecked: [true, Validators.required]
    });

    if (user.firstname && user.lastname) {
      this.checkoutForm.get('name').setValue(`${user.firstname} ${user.lastname}`);
      this.checkoutForm.updateValueAndValidity();
    }
  }

  public payWithFlutter() {

    this.router.navigate(['/listings/checkout/confirmation']);
  }
  public payWithPaystack() {

    this.router.navigate(['/listings/checkout/confirmation']);
  }
  public payWithMonnify() {

    this.router.navigate(['/listings/checkout/confirmation']);
    // MonnifySDK.initialize({
    //   amount: 5000,
    //   currency: "NGN",
    //   reference: '' + Math.floor((Math.random() * 1000000000) + 1),
    //   customerName: "John Doe",
    //   customerEmail: "monnify@monnify.com",
    //   apiKey: "MK_TEST_SAF7HR5F3F",
    //   contractCode: "4934121693",
    //   paymentDescription: "Test Pay",
    //   isTestMode: true,
    //   metadata: {
    //     "name": "Damilare",
    //     "age": 45
    //   },
    //   paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
    //   incomeSplitConfig: [
    //     {
    //       "subAccountCode": "MFY_SUB_342113621921",
    //       "feePercentage": 50,
    //       "splitAmount": 1900,
    //       "feeBearer": true
    //     },
    //     {
    //       "subAccountCode": "MFY_SUB_342113621922",
    //       "feePercentage": 50,
    //       "splitAmount": 2100,
    //       "feeBearer": true
    //     }
    //   ],
    //   onComplete: function (response) {
    //     //Implement what happens when transaction is completed.
    //     console.log(response);
    //   },
    //   onClose: function (data) {
    //     //Implement what should happen when the modal is closed here
    //     console.log(data);
    //   }
    // });
  }

  async createOrder() {
    try {

      this.orderInfo.order_number = '';
      this.orderInfo.user_info = '';
      this.orderInfo.order_details = this.cartProducts;
      this.orderInfo.order_payment_method = '';
      this.orderInfo.order_charge = this.balance;
      this.orderInfo.coupon_code = 'NO-CODE';
      this.orderInfo.coupon_amount = 0.00;
      this.orderInfo.total_amount = this.subtotal;
      this.orderInfo.order_type = '';
      this.orderInfo.payment_status = '';
      this.orderInfo.status = '';
      this.orderInfo.order_payment_details = '';

      const orderAdded = await this.storeService.checkout(JSON.stringify(this.orderInfo));
      if (orderAdded) {

      }

      if (this.cartProducts.length > 0) {
        this.cartProducts.forEach(async (propperty: any) => {
          await this.storeService.addToListing(propperty);
        });
      }



    } catch (error) {
      console.log('Order Error', error)
    }
  }

  public addTransactionHistory() {


  }


}
