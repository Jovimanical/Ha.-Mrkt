import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogComponent } from './blog/blog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { EstateSearchComponent } from './estate-search/estate-search.component';
import { FAQsComponent } from './faqs/faqs.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
import { TermOfUseComponent } from './term-of-use/term-of-use.component';
import { EstateLoanOptionsComponent } from './estate-loan-options/estate-loan-options.component';
import { ChoiceLandComponent } from './choice-land/choice-land.component'
import { ChoiceBuildingComponent } from './choice-building/choice-building.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const aboutUsRoutes: Routes = [
  { path: 'about-us', component: AboutUsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'faqs', component: FAQsComponent },
  { path: 'help-center', component: HelpCenterComponent },
  { path: 'terms-of-use', component: TermOfUseComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'schedule-meeting', component: ScheduleMeetingComponent },
  { path: 'estate-listing', component: EstateSearchComponent },
  { path: 'estate-loan-options', component: EstateLoanOptionsComponent },
  { path: 'buy-land', component: ChoiceLandComponent },
  { path: 'buy-house', component: ChoiceBuildingComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  // { path: 'contact-us', component: ContactUsComponent },
  // { path: 'contact-us', component: ContactUsComponent },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(aboutUsRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
