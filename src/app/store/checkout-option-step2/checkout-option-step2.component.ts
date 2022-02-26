import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NgWizardStep } from '@cmdap/ng-wizard';

@Component({
  selector: 'app-checkout-option-step2',
  templateUrl: './checkout-option-step2.component.html',
  styleUrls: ['./checkout-option-step2.component.scss']
})
export class CheckoutOptionStep2Component extends NgWizardStep implements OnInit {
  public form = new FormGroup({});
  public model: any = {};
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [
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
          className: 'col-sm-12 col-md-6',
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
          type: 'input',
          className: 'col-sm-6 col-md-6',
          templateOptions: {
            label: 'Date Of Employment',
            type: 'date',
          },
          validators: {
            validation: ['date-future'],
          },
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


  constructor() {
    super();
   }

  ngOnInit(): void {
  }

  submit() {
    if (this.form.valid) {
      alert(this.model);
    }
  }
}
