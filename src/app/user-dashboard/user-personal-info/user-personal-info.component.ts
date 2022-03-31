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
      //console.log('results-show', results)
      if (results.data?.records instanceof Array && results.data.records.length > 0) {
        this.existingPersonalInfo = results.data.records[0];
        this.initializeForm(results.data.records[0]);
        // this.hasExistingPersonalInfo = true
      }

      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });


  }

  ngAfterViewInit(): void {


  }

  private initializeForm(existingPersonalInfo: any): void {
    //console.log('existingPersonalInfo', existingPersonalInfo)
    this.personalInfoForm = this.formBuilder.group({
      customer_firstname: [existingPersonalInfo.customer_firstname ? existingPersonalInfo.customer_firstname : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_lastname: [existingPersonalInfo.customer_lastname ? existingPersonalInfo.customer_lastname : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_dob: [existingPersonalInfo.customer_dob ? existingPersonalInfo.customer_dob : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_gender: [existingPersonalInfo.customer_gender ? existingPersonalInfo.customer_gender : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_phone_no: [existingPersonalInfo.customer_phone_no ? existingPersonalInfo.customer_phone_no : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_email: [existingPersonalInfo.customer_email ? existingPersonalInfo.customer_email : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      bvn: [existingPersonalInfo.bvn ? existingPersonalInfo.bvn : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      pencomPin: [existingPersonalInfo.pencomPin ? existingPersonalInfo.pencomPin : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_residence_type: [existingPersonalInfo.customer_residence_type ? existingPersonalInfo.customer_residence_type : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_house_number: [existingPersonalInfo.customer_house_number ? existingPersonalInfo.customer_house_number : '', [Validators.minLength(1), Validators.maxLength(30), Validators.required]],
      customer_house_address: [existingPersonalInfo.customer_house_address ? existingPersonalInfo.customer_house_address : '', [Validators.minLength(3), Validators.maxLength(200), Validators.required]],
      customer_state: [existingPersonalInfo.customer_state ? existingPersonalInfo.customer_state : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_city: [existingPersonalInfo.customer_city ? existingPersonalInfo.customer_city : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_lga: [existingPersonalInfo.customer_lga ? existingPersonalInfo.customer_lga : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_country: [existingPersonalInfo.customer_country ? existingPersonalInfo.customer_country : '', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      customer_stay_duration: [existingPersonalInfo.customer_stay_duration ? existingPersonalInfo.customer_stay_duration : '', [Validators.minLength(1), Validators.maxLength(30), Validators.required]],

    });

  }
  async userRegister(param: any) {
    try {
      // console.log('this.personalInfoForm', this.personalInfoForm)
      if (this.personalInfoForm.valid) {

        let updatePersonlInfo = this.personalInfoForm.value
        updatePersonlInfo.id = this.existingPersonalInfo.id;

        const addPersonalInfo: any = await this.storeService.updateKYCPersonalInfo(JSON.stringify(updatePersonlInfo));
        if (addPersonalInfo instanceof Object && addPersonalInfo.status === 'success') {
          // move to step two
          // this.wizard.goToNextStep()
          if (param === 1) {
            //Just save and go back
            this.router.navigate(['/user-dashboard/user-profile']);
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
