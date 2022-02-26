import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MovingDirection, WizardComponent } from 'angular-archwizard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { StoreService } from 'app/shared/services/store.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

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

  public form = new FormGroup({});
  public formEmployerInfo = new FormGroup({});
  public formRequiredDocs = new FormGroup({});
  public model: any = {
    maxDate: "2019-09-25"
  };
  public modelEmployerInfo: any = {
    maxDate: "2022-01-01"
  };
  public modelRequiredDocs: any = {};

  public options: FormlyFormOptions = {};
  public optionsEmployerInfo: FormlyFormOptions = {};
  public optionsRequiredDocs: FormlyFormOptions = {};
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

  public fieldsRequiredDocs: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5 class="form-title">Upload Required Documents</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'customer_employer_id',
          type: 'file',
          className: 'col-sm-4 col-md-4',
          templateOptions: {
            label: 'Company/Staff ID?',
            required: true,
          }
        },
        {
          key: 'customer_government_id',
          type: 'file',
          className: 'col-sm-4 col-md-4',
          templateOptions: {
            label: 'Government Issued ID?',
            required: true,
          }
        },
        {
          key: 'customer_utility_bill',
          type: 'file',
          className: 'col-sm-4 col-md-4',
          templateOptions: {
            label: 'Utility Bill',
            required: true,
          }
        },
        {
          template: '<div style="margin: 20px;"><span class="form-title">Bank Statements Upload using:</span></div>',
        },
        {
          key: 'customer_upload_type',
          type: 'radio',
          className: 'col-sm-12 col-md-12',
          templateOptions: {
            label: 'Choose a method to upload?',
            required: true,
            valueProp: (option) => option,
            compareWith: (o1, o2) => o1.value == o2.value,
            options: [
              { label: 'Bank Account Linkup', value: 'linkup' },
              { label: 'PDF upload', value: 'upload' },
            ]
          }
        },

        {
          key: 'customer_bank_statement_file',
          type: 'file',
          className: 'col-sm-8 col-md-8',
          templateOptions: {
            label: 'Upload 6 months Statement of the current Year',
            required: true,
          },
          hideExpression: 'model.customer_upload_type?.value !== "upload"',
        },
        {
          key: 'customer_bank_statement_password',
          type: 'input',
          className: 'col-sm-4 col-md-4',
          templateOptions: {
            label: 'Enter PDF password',
            placeholder: 'Enter PDF Password',
            required: true,
          },
          hideExpression: 'model.customer_upload_type?.value !== "upload"',
        },
        {
          key: 'upload_with_mono',
          type: 'button',
          templateOptions: {
            text: 'UPload',
            onClick: ($event) => {

            },
          },
          hideExpression: 'model.customer_upload_type?.value !== "linkup"',
        },
        {
          key: 'upload_with_okra',
          type: 'button',
          templateOptions: {
            text: 'UPload',
            onClick: ($event) => {

            },
          },
          hideExpression: 'model.customer_upload_type?.value !== "linkup"',
        },
      ]
    }
  ];

  public myForm = new FormGroup({
    staffIdFile: new FormControl('', [Validators.required]),
    staffIdFileSource: new FormControl('', [Validators.required]),
    governmentIdFile: new FormControl('', [Validators.required]),
    governmentIdFileSource: new FormControl('', [Validators.required]),
    utilityBillFile: new FormControl('', [Validators.required]),
    utilityBillFileSource: new FormControl('', [Validators.required]),
    bankStatmentFile: new FormControl('', [Validators.required]),
    bankStatmentFileSource: new FormControl('', [Validators.required])
  });

  constructor(
    private storeService: StoreService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  getData() {
    this.wizard.wizardSteps.forEach(res => {
      if (res.selected) {
        console.log(res.stepTitle, res);
      }
    });
  }

  async submit() {
    try {
      if (this.form.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const addPersonalInfo: any = await this.storeService.addKYCPersonalInfo(JSON.stringify(this.model));
        if (addPersonalInfo && addPersonalInfo.data.status === 'success') {
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
        if (addPersonalInfo && addPersonalInfo.data.status === 'success') {
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

  submitRequiredDocs() {
    if (this.formRequiredDocs.valid) {
      console.log('this.modelRequiredDocs', this.modelRequiredDocs);
      console.log('this.form', this.formRequiredDocs);
    }
  }

  submit_() {

    if (this.myForm.valid) {
      const formData = new FormData();
      formData.append('fileUpload[]', this.myForm.get('staffIdFileSource')?.value);
      formData.append('fileUpload[]', this.myForm.get('governmentIdFileSource')?.value);
      formData.append('fileUpload[]', this.myForm.get('utilityBillFileSource')?.value);

      this.http.post(`${environment.API_URL}/kyc-documents/add/`, formData)
        .subscribe(res => {
          console.log(res);
          alert('Uploaded Successfully.');
          this.router.navigate(['/store/checkout']);
        }, error => {
          console.log('_submit() error', error)
        })
    }
  }

}
