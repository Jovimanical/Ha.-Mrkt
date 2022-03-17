import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstateSearchComponent } from './estate-search.component';

const routes: Routes = [{ path: '', component: EstateSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateSearchRoutingModule { }
