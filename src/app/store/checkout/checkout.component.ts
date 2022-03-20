import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from "flutterwave-angular-v3";
import { NotificationService } from 'app/shared/services/notification.service';

import { UserService } from 'app/core/user/user.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { User } from 'app/core/user/user.model';
import { StoreService } from 'app/shared/services/store.service';
import { Checkout } from 'app/shared/models/checkout.model';

declare var MonnifySDK: any

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;
  public userInfo: any = {};
  public balance = 0;
  public subtotal = 0;
  public numberOfProperties = 0
  public loading = true;
  public orderInfo: any = {};
  public cartProducts: Array<any> = [];
  public propertyID: any = 0;
  public transactionReference: any = '';


  //futterwave
  public paymentData: InlinePaymentOptions;
  public customerDetails: any
  public customizations: any
  public meta: any

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private notificationService: NotificationService,
    private userService: UserService,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute,
    private flutterwave: Flutterwave,
    public changeDectection: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.userInfo = user.data;
      this.initializeForm(user.data);
    }, (error) => {

    });

    this.route.params.subscribe((params: any) => {
      this.propertyID = params['id'];
      this.storeService.fetchCartItem(params['id']).subscribe((response: any) => {
        // console.log('response.data.records', response.data);

        if (response.data instanceof Object && Object.keys(response.data).length !== 0) {
          // save to loal store
          let cartItem = response.data
          this.subtotal += cartItem.PropertyAmount ? parseFloat(cartItem.PropertyAmount) : 0;
          this.balance += 300
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
    this.transactionReference = this.generateReference()
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


  public paystackPaymentInit() {
    console.log('Payment initialized');
    this.meta = {
      "propertyUnit": this.cartProducts[0].PropertyId,
      "PropertyEstate": this.cartProducts[0].EntityParent
    }
  }

  async paystackPaymentDone(response: any) {
    try {
      const title = 'Payment Paystack successfull';
      console.log(title, response);

      this.orderInfo.order_number = response.reference;
      this.orderInfo.user_info = Object.assign({ name: this.userInfo.firstname + this.userInfo.lastname, email: this.userInfo.email, phone_number: this.userInfo.mobile }, this.meta);
      this.orderInfo.order_details = this.cartProducts[0];
      this.orderInfo.order_payment_method = 'PAYSTACK';
      this.orderInfo.order_charge = this.balance;
      this.orderInfo.coupon_code = 'NO-CODE';
      this.orderInfo.coupon_amount = 0.00;
      this.orderInfo.total_amount = this.subtotal;
      this.orderInfo.order_type = 1;
      this.orderInfo.payment_status = response.status;
      this.orderInfo.status = 1;
      this.orderInfo.order_payment_details = response;
      this.orderInfo.user_id = this.userInfo.id;

      const sendOrderInfo = JSON.stringify(this.orderInfo)


      const orderAdded = await this.storeService.checkout(sendOrderInfo);
      if (orderAdded) {
        let transactionHistory: any = {}
        transactionHistory.sender_id = this.userInfo.id;
        transactionHistory.receiver_id = 1
        transactionHistory.amount = this.balance;
        transactionHistory.charge = 25
        transactionHistory.post_balance = 0.00
        transactionHistory.transaction_type = 'APPLICATION FEES'
        transactionHistory.sender_Account = this.userInfo.mobile
        transactionHistory.receiver_Account = 'HOUSEAFRICA001'
        transactionHistory.trx = response.reference;
        transactionHistory.details = 'PAYMENT FOR APPLICATION PROCESSING FEES FOR LOAN/MORTGAGE';
        transactionHistory.created_at = new Date()
        transactionHistory.updated_at = new Date()

        const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
        if (addTHistory) {
          this.createOrder()
        }
        this.router.navigate([`/listings/checkout/confirmation/${this.propertyID}`]);
      }
    } catch (error) {
      console.log('error-paystack', error)
    }


  }

  public paystackPaymentCancel() {
    console.log('payment failed');
  }


  async makeFlutterwavePaymentCallback(response: PaymentSuccessResponse) {
    // console.log("Payment Flutterwave callback", response);
    try {
      this.orderInfo.order_number = response.tx_ref;
      this.orderInfo.user_info = Object.assign(response.customer, this.meta);
      this.orderInfo.order_details = this.cartProducts[0];
      this.orderInfo.order_payment_method = 'FLUTTERWAVE';
      this.orderInfo.order_charge = response.amount ? response.amount : this.balance;
      this.orderInfo.coupon_code = 'NO-CODE';
      this.orderInfo.coupon_amount = 0.00;
      this.orderInfo.total_amount = this.subtotal;
      this.orderInfo.order_type = 1;
      this.orderInfo.payment_status = response.status;
      this.orderInfo.status = 1;
      this.orderInfo.order_payment_details = response;
      this.orderInfo.user_id = this.userInfo.id;

      const sendOrderInfo = JSON.stringify(this.orderInfo)

      const orderAdded = await this.storeService.checkout(sendOrderInfo);
      if (orderAdded) {
        let transactionHistory: any = {}
        transactionHistory.sender_id = this.userInfo.id;
        transactionHistory.receiver_id = 1
        transactionHistory.amount = this.balance;
        transactionHistory.charge = 25;
        transactionHistory.post_balance = 0.00
        transactionHistory.transaction_type = 'APPLICATION FEES'
        transactionHistory.sender_Account = this.userInfo.mobile
        transactionHistory.receiver_Account = 'HOUSEAFRICA001'
        transactionHistory.trx = response.tx_ref;
        transactionHistory.details = 'PAYMENT FOR APPLICATION PROCESSING FEES FOR LOAN/MORTGAGE';
        transactionHistory.created_at = new Date()
        transactionHistory.updated_at = new Date()

        const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
        if (addTHistory) {
          this.createOrder()
        }
      }

      this.flutterwave.closePaymentModal(5)
      this.router.navigate([`/listings/checkout/confirmation/${this.propertyID}`]);
    } catch (error) {
      console.log('Error-flutter', error)
    }


  }

  public closedFlutterwavePaymentModal(): void {
    console.log('payment is closed');
  }

  public generateReference(): string {
    let date = new Date();
    return 'HA-Ref' + Math.floor((Math.random() * 1000000000) + 1) + date.getTime().toString();
  }

  public payWithFlutter() {

    this.customerDetails = { name: this.userInfo.firstname + this.userInfo.lastname, email: this.userInfo.email, phone_number: this.userInfo.mobile }
    this.customizations = { title: 'Application Fee', description: 'Application Processing Fee for Estate building and Land', logo: 'https://flutterwave.com/images/logo-colored.svg' }
    this.meta = {
      "propertyUnit": this.cartProducts[0].PropertyId,
      "PropertyEstate": this.cartProducts[0].EntityParent
    }

    this.paymentData = {
      public_key: 'FLWPUBK_TEST-f0ba49b14d6b0985bb1e54f53c2f3c4a-X',
      tx_ref: this.transactionReference,
      amount: this.balance,
      currency: 'NGN',
      payment_options: 'card,ussd',
      redirect_url: '',
      meta: this.meta,
      customer: this.customerDetails,
      customizations: this.customizations,
      callback: this.makeFlutterwavePaymentCallback,
      onclose: this.closedFlutterwavePaymentModal,
      callbackContext: this
    }

    setTimeout(() => {
      this.flutterwave.inlinePay(this.paymentData);
    }, 1000);

  }



  public payWithPaystack() {

    this.router.navigate(['/listings/checkout/confirmation']);
  }


  public payWithMonnify() {
    MonnifySDK.initialize({
      amount: this.balance,
      currency: "NGN",
      reference: this.transactionReference,
      customerName: this.userInfo.firstname + this.userInfo.lastname,
      customerEmail: this.userInfo.email,
      apiKey: "MK_TEST_69V2XNVZNX",
      contractCode: "3569003763",
      paymentDescription: "Application Processing Fee",
      isTestMode: true,
      metadata: {
        "propertyUnit": this.cartProducts[0].PropertyId,
        "PropertyEstate": this.cartProducts[0].EntityParent
      },
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      onComplete: async (response: any) => {
        //Implement what happens when transaction is completed.
        //console.log('response', response);
        if (response.authorizedAmount === this.balance) {
          this.orderInfo.order_number = response.paymentReference;
          this.orderInfo.user_info = Object.assign({ name: this.userInfo.firstname + this.userInfo.lastname, email: this.userInfo.email, phone_number: this.userInfo.mobile }, this.meta);
          this.orderInfo.order_details = this.cartProducts[0];
          this.orderInfo.order_payment_method = 'MONNIFY';
          this.orderInfo.order_charge = response.authorizedAmount ? response.authorizedAmount : this.balance;
          this.orderInfo.coupon_code = 'NO-CODE';
          this.orderInfo.coupon_amount = 0.00;
          this.orderInfo.total_amount = this.subtotal;
          this.orderInfo.order_type = 1;
          this.orderInfo.payment_status = response.paymentStatus;
          this.orderInfo.status = 1;
          this.orderInfo.order_payment_details = response;
          this.orderInfo.user_id = this.userInfo.id;

          const sendOrderInfo = JSON.stringify(this.orderInfo)

          const orderAdded = await this.storeService.checkout(sendOrderInfo);
          if (orderAdded) {

            let transactionHistory: any = {}
            transactionHistory.sender_id = this.userInfo.id;
            transactionHistory.receiver_id = 1
            transactionHistory.amount = this.balance;
            transactionHistory.charge = 25
            transactionHistory.post_balance = 0.00
            transactionHistory.transaction_type = 'APPLICATION FEES'
            transactionHistory.sender_Account = this.userInfo.mobile
            transactionHistory.receiver_Account = 'HOUSEAFRICA001'
            transactionHistory.trx = response.paymentReference;
            transactionHistory.details = 'PAYMENT FOR APPLICATION PROCESSING FEES FOR LOAN/MORTGAGE';
            transactionHistory.created_at = new Date()
            transactionHistory.updated_at = new Date()

            const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
            if (addTHistory) {
              this.createOrder()
            }

          }
          // this.router.navigate(['/listings/checkout/confirmation']);
          this.router.navigate([`/listings/checkout/confirmation/${this.propertyID}`]);
        }
      },
      onClose: function (data) {
        //Implement what should happen when the modal is closed here
        console.log(data);
      }
    });
  }

  async createOrder() {
    try {

      if (this.cartProducts.length > 0) {
        this.cartProducts.forEach(async (propperty: any) => {
          await this.storeService.addToListing(propperty);
        });
      }

    } catch (error) {
      console.log('Order Error', error)
    }
  }

  async addTransactionHistory() {

    let transactionHistory: any = {}
    transactionHistory.sender_id = this.userInfo.id;
    transactionHistory.receiver_id = 0
    transactionHistory.amount = this.balance;
    transactionHistory.charge = 0
    transactionHistory.post_balance = 0
    transactionHistory.transaction_type = 'APPLICATION PROCESSING FEES'
    transactionHistory.sender_Account = this.userInfo.mobile
    transactionHistory.receiver_Account = 'HOUSEAFRICA001'
    transactionHistory.trx
    transactionHistory.details
    transactionHistory.created_at = new Date()
    transactionHistory.updated_at = new Date()

    const orderAdded = await this.storeService.checkout(JSON.stringify(transactionHistory));
    if (orderAdded) {

    }

  }


}
