import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field'; //'@ngx-formly/core';

@Component({
    selector: 'formly-field-file',
    template: `
  <div class='file-input'>
    <input type="file" [formControl]="formControl" [formlyAttributes]="field">
    <span class='button'>Choose</span>
    <span class='label' data-js-label>No file selected</span>
  </div>
  `,
})
export class FormlyFieldFile extends FieldType { }

