import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstateLoanOptionsComponent } from './estate-loan-options.component';

const routes: Routes = [{ path: '', component: EstateLoanOptionsComponent },
{ path: 'buy-land', loadChildren: () => import('./choice-land/choice-land.module').then(m => m.ChoiceLandModule) },
{ path: 'buy-house', loadChildren: () => import('./choice-building/choice-building.module').then(m => m.ChoiceBuildingModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateLoanOptionsRoutingModule { }
