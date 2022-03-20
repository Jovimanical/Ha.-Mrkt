import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NgWizardStep } from '@cmdap/ng-wizard';
// import Okra from 'okra-js'

@Component({
  selector: 'app-checkout-option-step3',
  templateUrl: './checkout-option-step3.component.html',
  styleUrls: ['./checkout-option-step3.component.scss']
})
export class CheckoutOptionStep3Component extends NgWizardStep implements OnInit {
  public form = new FormGroup({});
  public model: any = {};
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [
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
