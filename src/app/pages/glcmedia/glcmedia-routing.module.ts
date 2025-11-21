import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlcmediaPage } from './glcmedia.page';

const routes: Routes = [
  {
    path: '',
    component: GlcmediaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlcmediaPageRoutingModule {}
