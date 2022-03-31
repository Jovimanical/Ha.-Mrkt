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
      if (results.data?.records instanceof Array && results.data.records.length > 0) {
        this.existingEmploymentInfo = results.data.records[0];
        this.initializeForm(results.data.records[0]);
        // this.hasExistingEmploymentInfo = true;
      }

      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });


  }

  ngAfterViewInit(): void {

  }

  private initializeForm(existingEmploymentInfo: any): void {
    this.EmploymentInfoForm = this.formBuilder.group({
      customer_employment_status: [existingEmploymentInfo.customer_employment_status ? existingEmploymentInfo.customer_employment_status : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_employer_name: [existingEmploymentInfo.customer_employer_name ? existingEmploymentInfo.customer_employer_name : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_employer_office_number: [existingEmploymentInfo.customer_employer_office_number ? existingEmploymentInfo.customer_employer_office_number : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_employer_address: [existingEmploymentInfo.customer_employer_address ? existingEmploymentInfo.customer_employer_address : '', [Validators.minLength(3), Validators.maxLength(200), Validators.required]],
      customer_employer_nearest_bustop: [existingEmploymentInfo.customer_employer_nearest_bustop ? existingEmploymentInfo.customer_employer_nearest_bustop : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_employer_state: [existingEmploymentInfo.customer_employer_state ? existingEmploymentInfo.customer_employer_state : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_employer_city: [existingEmploymentInfo.customer_employer_city ? existingEmploymentInfo.customer_employer_city : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_employer_lga: [existingEmploymentInfo.customer_employer_lga ? existingEmploymentInfo.customer_employer_lga : '', [Validators.minLength(1), Validators.maxLength(30), Validators.required]],
      customer_employer_country: [existingEmploymentInfo.customer_employer_country ? existingEmploymentInfo.customer_employer_country : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_employer_doe: [existingEmploymentInfo.customer_employer_doe ? existingEmploymentInfo.customer_employer_doe : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_account_bvn: [existingEmploymentInfo.customer_account_bvn ? existingEmploymentInfo.customer_account_bvn : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_account_monthly_salary: [existingEmploymentInfo.customer_account_monthly_salary ? existingEmploymentInfo.customer_account_monthly_salary : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_account_primary_bank: [existingEmploymentInfo.customer_account_primary_bank ? existingEmploymentInfo.customer_account_primary_bank : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_account_primary_bank_account: [existingEmploymentInfo.customer_account_primary_bank_account ? existingEmploymentInfo.customer_account_primary_bank_account : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
    });
  }

  async submitEmployerInfo(param: any) {
    try {

      // console.log('this.EmploymentInfoForm', this.EmploymentInfoForm)

      if (this.EmploymentInfoForm.valid) {
        // console.log('this.modelEmployerInfo', this.modelEmployerInfo);
        let updateEmploymentInfo = this.EmploymentInfoForm.value
        updateEmploymentInfo.id = this.existingEmploymentInfo.id;
        updateEmploymentInfo.follow_up = this.existingEmploymentInfo.follow_up;
        updateEmploymentInfo.comment = this.existingEmploymentInfo.comment;
        updateEmploymentInfo.created_at = this.existingEmploymentInfo.created_at;

        const updateEmplymentStatus: any = await this.storeService.updateKYCEmploymentStatus(JSON.stringify(updateEmploymentInfo));
        if (updateEmplymentStatus instanceof Object && updateEmplymentStatus.status === 'success') {
          // move to step three
          // this.EmploymentInfoForm.goToNextStep()
          if (param === 1) {
            //Just save and go back
            this.router.navigate(['/user-dashboard/user-profile']);
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
