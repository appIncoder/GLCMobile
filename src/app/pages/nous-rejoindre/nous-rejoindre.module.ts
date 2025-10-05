import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NousRejoindrePageRoutingModule } from './nous-rejoindre-routing.module';

import { NousRejoindrePage } from './nous-rejoindre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NousRejoindrePageRoutingModule,
    NousRejoindrePage
  ]
})
export class NousRejoindrePageModule {}
