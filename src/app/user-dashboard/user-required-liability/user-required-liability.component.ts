import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { StoreService } from 'app/shared/services/store.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-required-liability',
  templateUrl: './user-required-liability.component.html',
  styleUrls: ['./user-required-liability.component.scss']
})
export class UserRequiredLiabilityComponent implements OnInit {
  public existingCustomerLiability: Array<any> = [];
  public hasExistingCustomerLiability: boolean = false;
  public customerLiabilityForm: FormGroup;
  public isLoading: boolean = true;

  constructor(private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.storeService.getUserLiability().subscribe((results: any) => {
      if (results.data !== null) {
        this.existingCustomerLiability = results.data.records;
        this.hasExistingCustomerLiability = true;
        this.processExistingLiability(results.data.records)
      } else {
        this.processExistingLiability([])
      }
      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });
  }

  public customerLiability(): FormArray {
    return this.customerLiabilityForm.get("customerLiability") as FormArray;
  }

  public processExistingLiability(existingCustomerLiability: any) {
    this.customerLiabilityForm = this.formBuilder.group({
      liabilityname: 'LIABILITY_LIST',
      customerLiability: this.formBuilder.array([]),
    });
    // checks if existingCustomerLiability is an array

    if (existingCustomerLiability instanceof Array && existingCustomerLiability.length > 0) {
      existingCustomerLiability.forEach((liabilityParam: any) => {
        this.customerLiability().push(this.existingLiabilities(liabilityParam));
      });
    } else {
      this.addLiability();
    }

  }

  public removeLiability(i: number, param: any) {
    // console.log('param', i, param.value.id)
    if (param.value.id !== 0) {
      this.storeService.removeFromUserLiability(param.value.id).subscribe((liability) => {
        console.log('liability', liability)
        this.customerLiability().removeAt(i);
      })
    } else {
      this.customerLiability().removeAt(i);
    }
  }

  public addLiability() {
    this.customerLiability().push(this.newLiabilities());
  }

  public newLiabilities(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      accountNumber: ['', Validators.required],
      balance: ['', Validators.required],
      description: ['', Validators.required],
      liabilityType: ['', Validators.required],
      monthlyPayment: ['', Validators.required]
    })
  }

  public existingLiabilities(liabilityParam: any): FormGroup {
    return this.formBuilder.group({
      id: [liabilityParam.id],
      accountNumber: [liabilityParam.accountNumber, Validators.required],
      balance: [liabilityParam.balance, Validators.required],
      description: [liabilityParam.description, Validators.required],
      liabilityType: [liabilityParam.liabilityType, Validators.required],
      monthlyPayment: [liabilityParam.monthlyPayment, Validators.required],
      liability_status: [liabilityParam.liability_status]
    })
  }


  public goToNextStep() {
    this.router.navigate([`/user-dashboard/user-required-extra-income/`]);
  }

  async onSubmitLiability() {
    console.log(this.customerLiabilityForm.value);
    try {
      if (this.customerLiabilityForm.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const updateLiability: any = await this.storeService.updateKYCUserLiability(JSON.stringify(this.customerLiabilityForm.value));
        if (updateLiability instanceof Object && updateLiability.status === 'success') {
          // move to step two
          this.router.navigate([`/user-dashboard/user-required-extra-income/`]);
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

}
