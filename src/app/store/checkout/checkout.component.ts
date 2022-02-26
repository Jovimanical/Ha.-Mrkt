import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'app/shared/services/notification.service';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { User } from 'app/core/user/user.model';
import { StoreService } from 'app/shared/services/store.service';
import { Checkout } from 'app/shared/models/checkout.model';


declare var MonnifySDK: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;
  public balance = 3000;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private notificationService: NotificationService,
    private userService: UserService,
    private broadcastService: BroadcastService,
    private router: Router) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.initializeForm(user.data);
    }, (error) => {

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
    this.storeService.checkout(model).subscribe(result => {
      this.broadcastService.emitGetCart();
      this.broadcastService.emitGetBalance();
      this.router.navigate(['/store/checkout/confirmation']);
      this.loading = false;
    }, error => {
      this.notificationService.showErrorMessage(error.error[0].errorDescription);
      this.loading = false;
    });

  }

  private initializeForm(user: User): void {
    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [user.email, Validators.required],
      company: [user.company, Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });

    if (user.firstname && user.lastname) {
      this.checkoutForm.get('name').setValue(`${user.firstname} ${user.lastname}`);
      this.checkoutForm.updateValueAndValidity();
    }
  }

  public payWithMonnify() {
    MonnifySDK.initialize({
      amount: 5000,
      currency: "NGN",
      reference: '' + Math.floor((Math.random() * 1000000000) + 1),
      customerName: "John Doe",
      customerEmail: "monnify@monnify.com",
      apiKey: "MK_TEST_SAF7HR5F3F",
      contractCode: "4934121693",
      paymentDescription: "Test Pay",
      isTestMode: true,
      metadata: {
        "name": "Damilare",
        "age": 45
      },
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      incomeSplitConfig: [
        {
          "subAccountCode": "MFY_SUB_342113621921",
          "feePercentage": 50,
          "splitAmount": 1900,
          "feeBearer": true
        },
        {
          "subAccountCode": "MFY_SUB_342113621922",
          "feePercentage": 50,
          "splitAmount": 2100,
          "feeBearer": true
        }
      ],
      onComplete: function (response) {
        //Implement what happens when transaction is completed.
        console.log(response);
      },
      onClose: function (data) {
        //Implement what should happen when the modal is closed here
        console.log(data);
      }
    });
  }
}
