import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NousRejoindrePage } from './nous-rejoindre.page';

const routes: Routes = [
  {
    path: '',
    component: NousRejoindrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NousRejoindrePageRoutingModule {}
