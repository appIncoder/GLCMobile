import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CeQueNousCroyonsPageRoutingModule } from './ce-que-nous-croyons-routing.module';

import { CeQueNousCroyonsPage } from './ce-que-nous-croyons.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CeQueNousCroyonsPageRoutingModule,
    CeQueNousCroyonsPage
  ]
})
export class CeQueNousCroyonsPageModule {}
