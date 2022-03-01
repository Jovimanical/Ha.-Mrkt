import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoiceBuildingComponent } from './choice-building.component';

const routes: Routes = [{ path: '', component: ChoiceBuildingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoiceBuildingRoutingModule { }
