import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstateSearchRoutingModule } from './estate-search-routing.module';
import { EstateSearchComponent } from './estate-search.component';


@NgModule({
  declarations: [EstateSearchComponent],
  imports: [
    CommonModule,
    EstateSearchRoutingModule
  ]
})
export class EstateSearchModule { }
