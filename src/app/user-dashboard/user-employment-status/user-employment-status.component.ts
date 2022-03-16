import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'app/shared/services/store.service';
@Component({
  selector: 'app-user-employment-status',
  templateUrl: './user-employment-status.component.html',
  styleUrls: ['./user-employment-status.component.scss']
})
export class UserEmploymentStatusComponent implements OnInit, AfterViewInit {
  public existingEmploymentInfo: any = false;
  public EmploymentInfoForm = new FormGroup({});
  public isLoading: boolean = true;
  public hasExistingEmploymentInfo: boolean = false;
  constructor(private storeService: StoreService,
    private router: Router,
    public formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.storeService.getUserKYCEmploymentStatus().subscribe((results: any) => {
      // console.log('results-show', results)
      if (results.data !== null) {
        this.existingEmploymentInfo = results.data.records[0];
        // this.hasExistingEmploymentInfo = true;
      }

      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });


  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.EmploymentInfoForm = this.formBuilder.group({
        customer_employment_status: [this.existingEmploymentInfo.customer_employment_status ? this.existingEmploymentInfo.customer_employment_status : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_name: [this.existingEmploymentInfo.customer_employer_name ? this.existingEmploymentInfo.customer_employer_name : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_office_number: [this.existingEmploymentInfo.customer_employer_office_number ? this.existingEmploymentInfo.customer_employer_office_number : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_address: [this.existingEmploymentInfo.customer_employer_address ? this.existingEmploymentInfo.customer_employer_address : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_nearest_bustop: [this.existingEmploymentInfo.customer_employer_nearest_bustop ? this.existingEmploymentInfo.customer_employer_nearest_bustop : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_state: [this.existingEmploymentInfo.customer_employer_state ? this.existingEmploymentInfo.customer_employer_state : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_city: [this.existingEmploymentInfo.customer_employer_city ? this.existingEmploymentInfo.customer_employer_city : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_lga: [this.existingEmploymentInfo.customer_employer_lga ? this.existingEmploymentInfo.customer_employer_lga : '', [Validators.minLength(1), Validators.maxLength(30), Validators.required]],
        customer_employer_country: [this.existingEmploymentInfo.customer_employer_country ? this.existingEmploymentInfo.customer_employer_country : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_employer_doe: [this.existingEmploymentInfo.customer_employer_doe ? this.existingEmploymentInfo.customer_employer_doe : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_account_bvn: [this.existingEmploymentInfo.customer_account_bvn ? this.existingEmploymentInfo.customer_account_bvn : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_account_monthly_salary: [this.existingEmploymentInfo.customer_account_monthly_salary ? this.existingEmploymentInfo.customer_account_monthly_salary : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_account_primary_bank: [this.existingEmploymentInfo.customer_account_primary_bank ? this.existingEmploymentInfo.customer_account_primary_bank : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_account_primary_bank_account: [this.existingEmploymentInfo.customer_account_primary_bank_account ? this.existingEmploymentInfo.customer_account_primary_bank_account : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      });
    }, 5000);
  }


  async submitEmployerInfo(param: any) {
    try {

      if (this.EmploymentInfoForm.valid) {
        // console.log('this.modelEmployerInfo', this.modelEmployerInfo);
        const addPersonalInfo: any = await this.storeService.addKYCEmploymentStatus(JSON.stringify(this.EmploymentInfoForm.value));
        if (addPersonalInfo instanceof Object && addPersonalInfo.status === 'success') {
          // move to step three
          // this.EmploymentInfoForm.goToNextStep()
          if (param === 1) {
            //Just save and go back
            this.router.navigate(['/user-dashboard/user-land-registry']);
          } else {
            //save and continue
            this.router.navigate(['/user-dashboard/user-required-documents']);
          }
        }
      }
    } catch (error) {
      console.log('error submitEmployerInfo', error)
    }
  }

}
