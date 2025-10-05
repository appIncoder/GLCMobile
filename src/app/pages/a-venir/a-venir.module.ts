import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AVenirPageRoutingModule } from './a-venir-routing.module';

import { AVenirPage } from './a-venir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AVenirPageRoutingModule,
    AVenirPage
  ],
  // AVenirPage is a standalone component (Angular >= 14+). Standalone components
  // must be imported into the NgModule instead of declared.
  // No declarations needed here for the standalone component.
})
export class AVenirPageModule {}
