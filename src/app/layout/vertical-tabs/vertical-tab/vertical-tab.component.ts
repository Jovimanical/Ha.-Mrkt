import { Component, OnInit, Input, ContentChild, TemplateRef, ViewContainerRef, ViewChild, AfterContentInit } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { VerticalTabContentDirective } from '../directives/vertical-tab-content.directive';
import { VerticalTabLabelDirective } from '../directives/vertical-tab-label.directive';

@Component({
  selector: 'app-vertical-tab',
  templateUrl: './vertical-tab.component.html',
  styleUrls: ['./vertical-tab.component.css']
})
export class VerticalTabComponent implements OnInit, AfterContentInit {
  @Input() label = '';

  @ContentChild(VerticalTabContentDirective, { read: TemplateRef, static: false })
  contentTemplate: TemplateRef<VerticalTabContentDirective>;

  @ContentChild(VerticalTabLabelDirective, { read: TemplateRef, static: false }) labelTemplate: TemplateRef<VerticalTabLabelDirective>;

  constructor(
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    // console.log('label', this.labelTemplate);
    // console.log('content', this.contentTemplate);
  }
}
