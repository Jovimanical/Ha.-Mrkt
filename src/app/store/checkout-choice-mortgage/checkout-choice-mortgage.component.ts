import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MovingDirection, WizardComponent } from 'angular-archwizard';
import { forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { StoreService } from 'app/shared/services/store.service';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-checkout-choice-mortgage',
  templateUrl: './checkout-choice-mortgage.component.html',
  styleUrls: ['./checkout-choice-mortgage.component.scss']
})
export class CheckoutChoiceMortgageComponent implements OnInit {
  @ViewChild(WizardComponent) public wizard: WizardComponent;
  @ViewChild('labelStaffID') public labelStaffID: ElementRef;
  @ViewChild('labelGovtID') public labelGovtID: ElementRef;
  @ViewChild('labelUtlity') public labelUtlity: ElementRef;
  @ViewChild('bankStatement') public bankStatement: ElementRef;

  public propertyID: any = 0;

  public form = new FormGroup({});
  public formEmployerInfo = new FormGroup({});
  public model: any = {
    maxDate: "2019-09-25"
  };
  public modelEmployerInfo: any = {
    maxDate: "2022-01-01"
  };
  public options: FormlyFormOptions = {};
  public optionsEmployerInfo: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5 class="form-title">Personal data</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'customer_firstname',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Fistname',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_lastname',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Lastname',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_dob',
          type: 'datepicker',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Date Of birth',
            required: true,
            datepickerOptions: {
              min: '2009-01-01'
            },
            expressionProperties:
              { 'templateOptions.datepickerOptions.max': 'model.maxDate', },
          }
        },
        {
          key: 'customer_gender',
          type: 'radio',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Gender',
            required: true,
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]
          }
        },
        {
          key: 'customer_phone_no',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Phone number',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_email',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Email',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_residence_type',
          type: 'radio',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Residence Details',
            required: true,
            options: [
              { label: 'Home Owner', value: 'landlord' },
              { label: 'Tenant', value: 'tenant' },
            ]
          }
        },
        {
          key: 'customer_house_number',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'House/ Flat Number',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_house_address',
          type: 'textarea',
          className: 'col-sm-12 col-md-12',
          templateOptions: {
            label: 'Street Address',
            placeholder: 'Textarea placeholder',
            required: true,
          }
        },
        {
          key: 'customer_nearest_stop',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Nearest Bus Stop',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_state',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'State',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_city',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'City',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_lga',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Local Goverment Area',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_country',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Country',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_stay_duration',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'How long have you been living there',
            placeholder: 'Input placeholder',
            required: true,
          }
        }
      ]
    }
  ];

  public fieldsEmployerInfo: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5 class="form-title">Employment Information</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'customer_employment_status',
          type: 'radio',
          className: 'col-sm-12 col-md-12',
          templateOptions: {
            label: 'Which best describes you?',
            required: true,
            options: [
              { label: 'Business Owner', value: 'business owner' },
              { label: 'Salary Earner', value: 'Salary Earner' },
              { label: 'Both', value: 'Both' },
            ]
          }
        },
        {
          template: '<div style="margin: 20px;"><span class="form-title">Employer/ Company Details:</span></div>',
        },
        {
          key: 'customer_employer_name',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Name of Company/Employer',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_employer_office_number',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Company/Office address plot number',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_employer_address',
          type: 'textarea',
          className: 'col-sm-12 col-md-12',
          templateOptions: {
            label: 'Company/Office Address',
            placeholder: 'Textarea placeholder',
            required: true,
          }
        },
        {
          key: 'customer_employer_nearest_bustop',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Nearest Bus Stop',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_employer_state',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'State',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_employer_city',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'City',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_employer_lga',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Local Goverment Area',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_employer_country',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Country',
            placeholder: 'Placeholder',
            required: true,
          },
        },
        {
          key: 'customer_employer_doe',
          type: 'datepicker',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Date Of Employment',
            required: true,
            datepickerOptions: {
              min: '2022-01-01'
            },
            expressionProperties:
              { 'templateOptions.datepickerOptions.max': 'modelEmployerInfo.maxDate', },
          }
        },
        {
          template: '<div style="margin: 20px;"><span class="form-title">Income/Salary Bank Details:</span></div>',
        },
        {
          key: 'customer_account_bvn',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Bank Verification Number',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_account_monthly_salary',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Monthy Income/Salary',
            placeholder: 'Input placeholder',
            required: true,
          }
        },
        {
          key: 'customer_account_primary_bank',
          type: 'select',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Select Primary Bank',
            placeholder: 'Select Primary Bank',
            required: true,
            options: [
              { label: 'GTBANK', value: '1' },
              { label: 'KUDA', value: '2' },
              { label: 'REFUGE BANK', value: '3' },
            ]
          }
        },
        {
          key: 'customer_account_primary_bank_account',
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Bank Account Number',
            placeholder: 'Input placeholder',
            required: true,
          }
        }
      ]
    }
  ];

  public myForm = new FormGroup({
    staffIdFile: new FormControl('', [Validators.required]),
    staffIdFileSource: new FormControl('', [Validators.required]),
    governmentIdFile: new FormControl('', [Validators.required]),
    governmentIdFileSource: new FormControl('', [Validators.required]),
    utilityBillFile: new FormControl('', [Validators.required]),
    utilityBillFileSource: new FormControl('', [Validators.required])
  });

  public myStatementUploadForm = new FormGroup({
    file_password: new FormControl('', [Validators.required]),
    bankStatmentFile: new FormControl('', [Validators.required]),
    bankStatmentFileSource: new FormControl('', [Validators.required])
  });

  public customerAssetForm: FormGroup;
  public customerLiabilityForm: FormGroup;
  public customerAdditionalIncome: FormGroup;

  public existingPersonalInfo: any = false;
  public hasExistingPersonalInfo: boolean = false;
  public existingEmploymentInfo: any = false;
  public hasExistingEmploymentInfo: boolean = false;
  public existingRequiredDocs: Array<any> = [];
  public hasExistingRequiredDocs: boolean = false;

  public existingCustomerAsset: Array<any> = [];
  public hasExistingCustomerAsset: boolean = false;

  public existingCustomerLiability: Array<any> = [];
  public hasExistingCustomerLiability: boolean = false;

  public existingCustomerAdditionalIncome: Array<any> = [];
  public hasExistingCustomerAdditionalIncome: boolean = false;



  public isLoading: boolean = true;

  public propertyItem: any = {}

  constructor(
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public formBuilder: FormBuilder
  ) {
    this.hasExistingPersonalInfo = false;
    this.hasExistingEmploymentInfo = false;
    this.hasExistingRequiredDocs = false;
    this.route.params.subscribe((params: any) => {
      this.propertyID = params['id'];
      this.storeService.fetchCartItem(params['id']).subscribe((response: any) => {
        // console.log('response.data.records', response.data);
        if (response.data instanceof Object && Object.keys(response.data).length !== 0) {
          // save to loal store
          let cartItem = response.data
          if (cartItem?.PropertyJson) {
            cartItem.PropertyJson = JSON.parse(cartItem.PropertyJson);
          }

          this.propertyItem = cartItem;

        } else {
          this.propertyItem = {};
        }
      }, (error) => {

      });
    });
  }

  ngOnInit(): void {

    let personalInfo = this.storeService.getUserKYCPersonalInfo();
    let employermentInfo = this.storeService.getUserKYCEmploymentStatus();
    let requiredDocs = this.storeService.getUserKYCRequiredDocs();
    let requiredAssets = this.storeService.getKYCUserAssets();
    let requiredLiability = this.storeService.getUserLiability();
    let requiredExtraIncome = this.storeService.getUserExtraIncome();



    forkJoin([personalInfo, employermentInfo, requiredDocs, requiredAssets, requiredLiability, requiredExtraIncome]).subscribe((results: any) => {
      // console.log('results-show', results)
      if (results[0].data !== null) {
        this.existingPersonalInfo = results[0].data.records[0];
        this.hasExistingPersonalInfo = true
      }


      if (results[1].data !== null) {
        this.existingEmploymentInfo = results[1].data.records[0];
        this.hasExistingEmploymentInfo = true;
      }


      if (results[2].data !== null) {
        this.existingRequiredDocs = results[2].data.records;
        this.hasExistingRequiredDocs = true;
      }
      
      if (results[3].data !== null) {
        this.existingCustomerAsset = results[3].data.records;
        this.hasExistingCustomerAsset = true;
      }
      
      if (results[4].data !== null) {
        this.existingCustomerLiability = results[4].data.records;
        this.hasExistingCustomerLiability = true;
      }
      
      if (results[5].data !== null) {
        this.existingCustomerAdditionalIncome = results[5].data.records;
        this.hasExistingCustomerAdditionalIncome = true;
      }

      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });


    this.customerAssetForm = this.formBuilder.group({
      assetname: 'NEW_ASSETS_LIST',
      customerAssets: this.formBuilder.array([]),
    });
    this.addAssets();


    this.customerLiabilityForm = this.formBuilder.group({
      liabilityname: 'LIABILITY_LIST',
      customerLiability: this.formBuilder.array([]),
    });
    this.addLiability();

    this.customerAdditionalIncome = this.formBuilder.group({
      extraIncomename: 'ADDITIONAL_INCOME',
      customerAdditional: this.formBuilder.array([]),
    });
    this.addExtraIncome();
  }


  public customerAssets(): FormArray {
    return this.customerAssetForm.get("customerAssets") as FormArray;
  }

  get myAssets(): FormArray {
    return <FormArray>this.customerAssetForm.get("customerAssets");
  }

  public customerLiability(): FormArray {
    return this.customerLiabilityForm.get("customerLiability") as FormArray;
  }

  public customerAdditional(): FormArray {
    return this.customerAdditionalIncome.get("customerAdditional") as FormArray;
  }

  public newAssets(): FormGroup {
    return this.formBuilder.group({
      assetType: ['', Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required]
    })
  }

  public newLiabilities(): FormGroup {
    return this.formBuilder.group({
      accountNumber: ['', Validators.required],
      balance: ['', Validators.required],
      description: ['', Validators.required],
      liabilityType: ['', Validators.required],
      monthlyPayment: ['', Validators.required]
    })
  }

  public newExtraIncome(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required],
      otherIncomeAmount: ['', Validators.required],
      otherIncomePeriod: ['', Validators.required],
      otherIncomeType: ['', Validators.required],
    })
  }

  public addAssets() {
    this.customerAssets().push(this.newAssets());
  }

  public addLiability() {
    this.customerLiability().push(this.newLiabilities());
  }

  public addExtraIncome() {
    this.customerAdditional().push(this.newExtraIncome());
  }

  public removeAssets(i: number) {
    this.customerAssets().removeAt(i);
  }

  public removeLiability(i: number) {
    this.customerLiability().removeAt(i);
  }

  public removeExtraIncome(i: number) {
    this.customerAdditional().removeAt(i);
  }

  async onSubmitAssets() {
    console.log(this.customerAssetForm.value);
    try {
      if (this.customerAssetForm.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const addAssets: any = await this.storeService.addKYCUserAssets(JSON.stringify(this.customerAssetForm.value));
        if (addAssets instanceof Object && addAssets.status === 'success') {
          // move to step two
          this.wizard.goToNextStep()
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

  async onSubmitLiability() {
    console.log(this.customerLiabilityForm.value);
    try {
      if (this.customerLiabilityForm.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const addLiability: any = await this.storeService.addKYCUserLiability(JSON.stringify(this.customerLiabilityForm.value));
        if (addLiability instanceof Object && addLiability.status === 'success') {
          // move to step two
          this.wizard.goToNextStep()
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

  async onSubmitAddIncome() {
    console.log(this.customerAdditionalIncome.value);
    try {
      if (this.customerAdditionalIncome.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const addAdditionalIncome: any = await this.storeService.addKYCUserExtraIncome(JSON.stringify(this.customerAdditionalIncome.value));
        if (addAdditionalIncome instanceof Object && addAdditionalIncome.status === 'success') {
          // move to step two      
          this.updateApplicationProcess(this.propertyItem);
          this.router.navigate([`/listings/checkout/${this.propertyID}`]);
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }


  public getData() {
    this.wizard.wizardSteps.forEach(res => {
      if (res.selected) {
        console.log(res.stepTitle, res);
      }
    });
  }

  public goToNextStep() {
    this.wizard.goToNextStep()
  }

  public goToCheckOut() {
    this.updateApplicationProcess(this.propertyItem);
    this.router.navigate([`/listings/checkout/${this.propertyID}`]);
  }

  async submit() {
    try {
      if (this.form.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const addPersonalInfo: any = await this.storeService.addKYCPersonalInfo(JSON.stringify(this.model));
        if (addPersonalInfo instanceof Object && addPersonalInfo.status === 'success') {
          // move to step two
          this.wizard.goToNextStep()
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

  async submitEmployerInfo() {
    try {

      if (this.formEmployerInfo.valid) {
        // console.log('this.modelEmployerInfo', this.modelEmployerInfo);
        const addPersonalInfo: any = await this.storeService.addKYCEmploymentStatus(JSON.stringify(this.modelEmployerInfo));
        if (addPersonalInfo instanceof Object && addPersonalInfo.status === 'success') {
          // move to step three
          this.wizard.goToNextStep()
        }
      }
    } catch (error) {
      console.log('error submitEmployerInfo', error)
    }
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  get f() {
    return this.myForm.controls;
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  onFileChange(event: any, params: any) {


    switch (params) {
      case 1:
        if (event.target.files.length > 0) {
          const file: any = event.target.files[0];
          this.labelStaffID.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');

          // console.log(' this.labelStaffID.nativeElement.innerText', this.labelStaffID.nativeElement.innerText)
          this.labelStaffID.nativeElement.className += '-chosen';
          this.myForm.patchValue({
            staffIdFileSource: file
          });
        }
        break;
      case 2:
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.labelGovtID.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');
          this.labelGovtID.nativeElement.className += '-chosen';
          this.myForm.patchValue({
            governmentIdFileSource: file
          });
        }
        break;
      case 3:
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.labelUtlity.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');

          this.labelUtlity.nativeElement.className += '-chosen';
          this.myForm.patchValue({
            utilityBillFileSource: file
          });
        }
        break;

      default:
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.labelUtlity.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');

          this.labelUtlity.nativeElement.className += '-chosen';
          this.myForm.patchValue({
            bankStatmentFileSource: file
          });
        }
        break;
    }
  }

  submitRequired() {

    if (this.myForm.valid) {
      const formData = new FormData();
      formData.append('fileUpload[]', this.myForm.get('staffIdFileSource')?.value);
      formData.append('fileUpload[]', this.myForm.get('governmentIdFileSource')?.value);
      formData.append('fileUpload[]', this.myForm.get('utilityBillFileSource')?.value);

      this.http.post(`${environment.API_URL}/kyc-documents/add/`, formData)
        .subscribe(res => {
          console.log(res);
          alert('Uploaded Successfully.');
          this.wizard.goToNextStep()
        }, error => {
          console.log('_submit() error', error)
        })
    }
  }

  public updateApplicationProcess(propertyItem: any) {
    const propertyInfo: any = propertyItem;
    propertyInfo.ApplicationStatus = 'PROCESSING';
    this.storeService.updateCartItem(JSON.stringify(propertyInfo)).subscribe((response: any) => {
      // console.log('response.data.records', response.data);

    }, (error) => {

    });
  }

}
