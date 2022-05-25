import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from "flutterwave-angular-v3";
import { NotificationService } from 'app/shared/services/notification.service';

import { UserService } from 'app/core/user/user.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { User } from 'app/core/user/user.model';
import { StoreService } from 'app/shared/services/store.service';
import { AccountService } from 'app/shared/accounts/account.service';


declare var MonnifySDK: any;
const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  allowEscapeKey: false,
})


@Component({
  selector: 'app-search-subscription',
  templateUrl: './search-subscription.component.html',
  styleUrls: ['./search-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchSubscriptionComponent implements OnInit, AfterViewInit {
  public searchSubsForm: FormGroup;
  public showForm: boolean = false;
  public userInfo: any = {};
  public searchAmount = 0;
  public searchTotal = 0;
  public numberOfProperties = 0
  public loading = true;
  public orderInfo: any = {};
  public propertyID: any = 0;
  public transactionReference: any = '';
  public userAccount: any = {}


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
    private accountService: AccountService,
    private route: ActivatedRoute,
    private flutterwave: Flutterwave,
    public changeDectection: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.userInfo = user.data;
  
    }, (error) => {

    });
    this.accountService.getUserAccounts().subscribe((accounts: any) => {
      // We're just supporting one account right now. Grab the first result.
      if (accounts.data.records instanceof Array && accounts.data.records.length > 0) {
        this.userAccount = accounts.data.records[0];
      }
    }, (error) => {
      // console.log('getAccounts - Error', error)
      if (error.error.message === 'Error : Expired token') {
        console.log('getAccounts call logout')
        // this.userService.logout();
      }
      // show payment Modal
    });

    this.transactionReference = this.generateReference()

  }

  ngAfterViewInit(): void {
    Swal.fire(
      'How to buy Search Credit!',
      'Select one of the search parkage to get started',
      'success'
    );
  }



  checkout(): void {
    if (this.searchSubsForm.invalid) {
      return;
    }
    this.loading = true;
  }

  public paystackPaymentInit() {
    console.log('Payment initialized');
    this.meta = {
      "searchName": "",
      "searchValue": ""
    }
  }

  async paystackPaymentDone(response: any) {
    try {
      // console.log('Payment Paystack successfull', response);
      this.userAccount.account_balance = this.searchAmount += parseInt(this.userAccount.account_balance, 10);
      this.userAccount.account_point = this.searchTotal += parseInt(this.userAccount.account_point, 10);
      const sendOrderInfo = JSON.stringify(this.userAccount)


      const orderAdded = await this.accountService.updateUserAccounts(sendOrderInfo);
      if (orderAdded) {
        let transactionHistory: any = {}
        transactionHistory.sender_id = this.userInfo.id;
        transactionHistory.receiver_id = 1
        transactionHistory.amount = this.searchAmount;
        transactionHistory.charge = 25
        transactionHistory.post_balance = 0.00
        transactionHistory.transaction_type = 'PROPERTY SEARCH FEES'
        transactionHistory.sender_Account = this.userInfo.mobile
        transactionHistory.receiver_Account = 'HOUSEAFRICA001'
        transactionHistory.trx = response.reference;
        transactionHistory.details = 'PAYMENT FOR PROPERTY SEARCH PROCESSING FEES FOR LOAN/MORTGAGE';
        transactionHistory.created_at = new Date()
        transactionHistory.updated_at = new Date()

        const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
        if (addTHistory) {
          // this.createOrder()
        }
        this.router.navigate([`/user-dashboard`]);
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

      this.userAccount.account_balance = this.searchAmount += parseInt(this.userAccount.account_balance, 10);
      this.userAccount.account_point = this.searchTotal += parseInt(this.userAccount.account_point, 10);
      const sendOrderInfo = JSON.stringify(this.userAccount)

      const orderAdded = await this.accountService.updateUserAccounts(sendOrderInfo);
      if (orderAdded) {
        let transactionHistory: any = {}
        transactionHistory.sender_id = this.userInfo.id;
        transactionHistory.receiver_id = 1
        transactionHistory.amount = this.searchAmount;
        transactionHistory.charge = 25;
        transactionHistory.post_balance = 0.00
        transactionHistory.transaction_type = 'PROPERTY SEARCH FEES'
        transactionHistory.sender_Account = this.userInfo.mobile
        transactionHistory.receiver_Account = 'HOUSEAFRICA001'
        transactionHistory.trx = response.tx_ref;
        transactionHistory.details = 'PAYMENT FOR PROPERTY SEARCH PROCESSING FEES FOR LOAN/MORTGAGE';
        transactionHistory.created_at = new Date()
        transactionHistory.updated_at = new Date()

        const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
        if (addTHistory) {
          // this.createOrder()
        }
      }

      this.flutterwave.closePaymentModal(5)
      this.router.navigate([`/user-dashboard`]);
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
      "propertyUnit": "",
      "PropertyEstate": ""
    }

    this.paymentData = {
      public_key: 'FLWPUBK_TEST-f0ba49b14d6b0985bb1e54f53c2f3c4a-X',
      tx_ref: this.transactionReference,
      amount: this.searchAmount,
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

    this.router.navigate(['/property-search/checkout/confirmation']);
  }


  public payWithMonnify() {
    MonnifySDK.initialize({
      amount: this.searchAmount,
      currency: "NGN",
      reference: this.transactionReference,
      customerName: this.userInfo.firstname + this.userInfo.lastname,
      customerEmail: this.userInfo.email,
      apiKey: "MK_TEST_69V2XNVZNX",
      contractCode: "3569003763",
      paymentDescription: "Application Processing Fee",
      isTestMode: true,
      metadata: {
        "propertyUnit": "",
        "PropertyEstate": ""
      },
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      onComplete: async (response: any) => {
        //Implement what happens when transaction is completed.
        //console.log('response', response);
        if (response.authorizedAmount === this.searchAmount) {
          this.userAccount.account_balance = this.searchAmount += parseInt(this.userAccount.account_balance, 10);
          this.userAccount.account_point = this.searchTotal += parseInt(this.userAccount.account_point, 10);
          const sendOrderInfo = JSON.stringify(this.userAccount)

          const orderAdded = await this.accountService.updateUserAccounts(sendOrderInfo);
          if (orderAdded) {

            let transactionHistory: any = {}
            transactionHistory.sender_id = this.userInfo.id;
            transactionHistory.receiver_id = 1
            transactionHistory.amount = this.searchAmount;
            transactionHistory.charge = 25
            transactionHistory.post_balance = 0.00
            transactionHistory.transaction_type = 'PROPERTY SEARCH FEES'
            transactionHistory.sender_Account = this.userInfo.mobile
            transactionHistory.receiver_Account = 'HOUSEAFRICA001'
            transactionHistory.trx = response.paymentReference;
            transactionHistory.details = 'PAYMENT FOR PROPERTY SEARCH PROCESSING FEES FOR LOAN/MORTGAGE';
            transactionHistory.created_at = new Date()
            transactionHistory.updated_at = new Date()

            const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
            if (addTHistory) {
              // this.createOrder()
            }

          }
          this.router.navigate([`/user-dashboard`]);
        }
      },
      onClose: function (data) {
        //Implement what should happen when the modal is closed here
        console.log(data);
      }
    });
  }


  selectPaidService(searchNo: any, searchAmount: any) {
    this.searchAmount = searchAmount;
    this.searchTotal = searchNo;
    Toast.fire({
      icon: 'success',
      title: `You have selected ${searchNo} valued  at ${searchAmount} NGN, please select a payment provider to continue`
    });
  }



}
