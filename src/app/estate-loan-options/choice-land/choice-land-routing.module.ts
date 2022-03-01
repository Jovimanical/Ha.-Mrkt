import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoiceLandComponent } from './choice-land.component';

const routes: Routes = [{ path: '', component: ChoiceLandComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoiceLandRoutingModule { }
