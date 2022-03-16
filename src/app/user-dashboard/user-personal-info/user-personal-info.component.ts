import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'app/shared/services/store.service';


@Component({
  selector: 'app-user-personal-info',
  templateUrl: './user-personal-info.component.html',
  styleUrls: ['./user-personal-info.component.scss']
})
export class UserPersonalInfoComponent implements OnInit, AfterViewInit {
  public existingPersonalInfo: any = {};
  public personalInfoForm = new FormGroup({});
  public isLoading: boolean = true;
  public hasExistingPersonalInfo: boolean = false;


  constructor(private storeService: StoreService,
    private router: Router,
    public formBuilder: FormBuilder,
    private http: HttpClient) {

  }

  ngOnInit(): void {
    this.storeService.getUserKYCPersonalInfo().subscribe((results: any) => {
      // console.log('results-show', results)
      if (results.data !== null) {
        this.existingPersonalInfo = results.data.records[0];
        // this.hasExistingPersonalInfo = true
      }

      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });

    
  }

  ngAfterViewInit(): void {
     setTimeout(() => {
      this.personalInfoForm = this.formBuilder.group({
        customer_firstname: [this.existingPersonalInfo.customer_firstname ? this.existingPersonalInfo.customer_firstname : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_lastname: [this.existingPersonalInfo.customer_lastname ? this.existingPersonalInfo.customer_lastname : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_dob: [this.existingPersonalInfo.customer_dob ? this.existingPersonalInfo.customer_dob : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_gender: [this.existingPersonalInfo.customer_gender ? this.existingPersonalInfo.customer_gender : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_phone_no: [this.existingPersonalInfo.customer_phone_no ? this.existingPersonalInfo.customer_phone_no : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_email: [this.existingPersonalInfo.customer_email ? this.existingPersonalInfo.customer_email : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_residence_type: [this.existingPersonalInfo.customer_residence_type ? this.existingPersonalInfo.customer_residence_type : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_house_number: [this.existingPersonalInfo.customer_house_number ? this.existingPersonalInfo.customer_house_number : '', [Validators.minLength(1), Validators.maxLength(30), Validators.required]],
        customer_house_address: [this.existingPersonalInfo.customer_house_address ? this.existingPersonalInfo.customer_house_address : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_nearest_stop: [this.existingPersonalInfo.customer_nearest_stop ? this.existingPersonalInfo.customer_nearest_stop : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_state: [this.existingPersonalInfo.customer_state ? this.existingPersonalInfo.customer_state : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_city: [this.existingPersonalInfo.customer_city ? this.existingPersonalInfo.customer_city : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_lga: [this.existingPersonalInfo.customer_lga ? this.existingPersonalInfo.customer_lga : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_country: [this.existingPersonalInfo.customer_country ? this.existingPersonalInfo.customer_country : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
        customer_stay_duration: [this.existingPersonalInfo.customer_stay_duration ? this.existingPersonalInfo.customer_stay_duration : '', [Validators.minLength(1), Validators.maxLength(30), Validators.required]],

      });
    }, 5000);
 
  }

  async userRegister(param: any) {
    try {
      if (this.personalInfoForm.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const addPersonalInfo: any = await this.storeService.addKYCPersonalInfo(JSON.stringify(this.personalInfoForm.value));
        if (addPersonalInfo instanceof Object && addPersonalInfo.status === 'success') {
          // move to step two
          // this.wizard.goToNextStep()
          if (param === 1) {
            //Just save and go back
            this.router.navigate(['/user-dashboard/user-land-registry']);
          } else {
            //save and continue
            this.router.navigate(['/user-dashboard/user-employment-status']);
          }
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

}
