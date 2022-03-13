import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[verticalTabLabel]'
})
export class VerticalTabLabelDirective {

  constructor(public template: TemplateRef<any>) { }

}