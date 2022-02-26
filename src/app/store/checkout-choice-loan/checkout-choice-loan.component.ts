import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NgWizardStep } from '@cmdap/ng-wizard';


@Component({
  selector: 'app-checkout-choice-loan',
  templateUrl: './checkout-choice-loan.component.html',
  styleUrls: ['./checkout-choice-loan.component.scss']
})
export class CheckoutChoiceLoanComponent extends NgWizardStep implements OnInit {

  public form = new FormGroup({});
  public model: any = {
    maxDate: "2019-09-25"
  };
  public options: FormlyFormOptions = {};
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

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  changeMaxDate() {
    this.model.maxDate = "2019-09-10";
  }

  submit() {
    if (this.form.valid) {
      console.log('this.model', this.model);
      console.log('this.form', this.form);
    }
  }

}
