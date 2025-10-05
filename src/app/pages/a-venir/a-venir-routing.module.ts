import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AVenirPage } from './a-venir.page';

const routes: Routes = [
  {
    path: '',
    component: AVenirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AVenirPageRoutingModule {}
