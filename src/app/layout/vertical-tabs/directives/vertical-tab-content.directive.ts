import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[verticalTabContent]'
})
export class VerticalTabContentDirective {

  constructor(public template: TemplateRef<any>) { }

}