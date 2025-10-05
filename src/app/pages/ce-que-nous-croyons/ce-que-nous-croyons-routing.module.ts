import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CeQueNousCroyonsPage } from './ce-que-nous-croyons.page';

const routes: Routes = [
  {
    path: '',
    component: CeQueNousCroyonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CeQueNousCroyonsPageRoutingModule {}
