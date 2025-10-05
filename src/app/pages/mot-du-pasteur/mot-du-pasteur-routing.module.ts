import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MotDuPasteurPage } from './mot-du-pasteur.page';

const routes: Routes = [
  {
    path: '',
    component: MotDuPasteurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotDuPasteurPageRoutingModule {}
