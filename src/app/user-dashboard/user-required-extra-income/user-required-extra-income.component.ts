import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { StoreService } from 'app/shared/services/store.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-required-extra-income',
  templateUrl: './user-required-extra-income.component.html',
  styleUrls: ['./user-required-extra-income.component.scss']
})
export class UserRequiredExtraIncomeComponent implements OnInit {


  public customerAdditionalIncome: FormGroup;
  public existingCustomerAdditionalIncome: Array<any> = [];
  public hasExistingCustomerAdditionalIncome: boolean = false;
  public isLoading: boolean = true;

  constructor(private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.storeService.getUserExtraIncome().subscribe((results: any) => {
      if (results.data !== null) {
        this.existingCustomerAdditionalIncome = results.data.records;
        this.hasExistingCustomerAdditionalIncome = true;
        this.processExistingExtraIncome(results.data.records)
      } else {
        this.processExistingExtraIncome([])
      }
      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });
  }

  public processExistingExtraIncome(existingCustomerAdditionalIncome: any) {
    this.customerAdditionalIncome = this.formBuilder.group({
      extraIncomename: 'ADDITIONAL_INCOME',
      customerAdditional: this.formBuilder.array([]),
    });

    // checks if existingCustomerAdditionalIncome is an array

    if (existingCustomerAdditionalIncome instanceof Array && existingCustomerAdditionalIncome.length > 0) {
      existingCustomerAdditionalIncome.forEach((extraIncomeParam: any) => {
        this.customerAdditional().push(this.existingExtraIncome(extraIncomeParam));
      });
    } else {
      this.addExtraIncome();
    }

  }

  public removeExtraIncome(i: number, param: any) {
      // console.log('param', i, param.value.id)
      if (param.value.id !== 0) {
        this.storeService.removeFromUserExtraIncome(param.value.id).subscribe((extraIncomeRemoved) => {
          console.log('extraIncomeRemoved', extraIncomeRemoved)
          this.customerAdditional().removeAt(i);
        })
      } else {
      this.customerAdditional().removeAt(i);  
      }
    
  }

  public addExtraIncome() {
    this.customerAdditional().push(this.newExtraIncome());
  }


  public newExtraIncome(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      description: ['', Validators.required],
      otherIncomeAmount: ['', Validators.required],
      otherIncomePeriod: ['', Validators.required],
      otherIncomeType: ['', Validators.required],
    })
  }

  public existingExtraIncome(extraIncomeParam: any): FormGroup {
    return this.formBuilder.group({
      id: [extraIncomeParam.id],
      description: [extraIncomeParam.description, Validators.required],
      otherIncomeAmount: [extraIncomeParam.otherIncomeAmount, Validators.required],
      otherIncomePeriod: [extraIncomeParam.otherIncomePeriod, Validators.required],
      otherIncomeType: [extraIncomeParam.otherIncomeType, Validators.required],
    })
  }

  public customerAdditional(): FormArray {
    return this.customerAdditionalIncome.get("customerAdditional") as FormArray;
  }


  public goToNextStep() {
    this.router.navigate([`/user-dashboard`]);
  }


  async onSubmitAddIncome() {
    console.log(this.customerAdditionalIncome.value);
    try {
      if (this.customerAdditionalIncome.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const updateAdditionalIncome: any = await this.storeService.updateKYCUserExtraIncome(JSON.stringify(this.customerAdditionalIncome.value));
        if (updateAdditionalIncome instanceof Object && updateAdditionalIncome.status === 'success') {
          // move to step two      
          this.router.navigate([`/user-dashboard`]);
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

}
