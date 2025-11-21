import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GlcmediaPageRoutingModule } from './glcmedia-routing.module';

import { GlcmediaPage } from './glcmedia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GlcmediaPageRoutingModule
  ],
  declarations: [GlcmediaPage]
})
export class GlcmediaPageModule {}
