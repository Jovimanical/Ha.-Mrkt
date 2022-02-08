import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreMaplayoutComponent } from './store-maplayout.component';

const routes: Routes = [{ path: '', component: StoreMaplayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreMaplayoutRoutingModule { }
