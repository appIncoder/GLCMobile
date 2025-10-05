import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MotDuPasteurPageRoutingModule } from './mot-du-pasteur-routing.module';

import { MotDuPasteurPage } from './mot-du-pasteur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MotDuPasteurPageRoutingModule,
    MotDuPasteurPage
  ]
})
export class MotDuPasteurPageModule {}
