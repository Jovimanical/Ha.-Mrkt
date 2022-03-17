import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { WebsiteRoutingModule } from './website-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactUsService } from './contact-us/contact-us.service';
import { BlogComponent } from './blog/blog.component';
import { EstateSearchComponent } from './estate-search/estate-search.component';
import { FAQsComponent } from './faqs/faqs.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
import { TermOfUseComponent } from './term-of-use/term-of-use.component';
import { EstateLoanOptionsComponent } from './estate-loan-options/estate-loan-options.component';
import { ChoiceLandComponent } from './choice-land/choice-land.component';
import { ChoiceBuildingComponent } from './choice-building/choice-building.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from 'app/shared/shared.module';
import { LayoutModule } from 'app/layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    SharedModule,
    LayoutModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AboutUsComponent,
    BlogComponent,
    ContactUsComponent,
    EstateSearchComponent,
    FAQsComponent,
    HelpCenterComponent,
    PrivacyPolicyComponent,
    ScheduleMeetingComponent,
    TermOfUseComponent,
    EstateLoanOptionsComponent,
    ChoiceLandComponent,
    ChoiceBuildingComponent,
    PageNotFoundComponent
  ],
  providers: [
    ContactUsService
  ]
})
export class WebsiteModule { }
