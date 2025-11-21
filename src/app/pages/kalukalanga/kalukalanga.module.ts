import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KalukalangaPageRoutingModule } from './kalukalanga-routing.module';

import { KalukalangaPage } from './kalukalanga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KalukalangaPageRoutingModule
  ],
  declarations: [KalukalangaPage]
})
export class KalukalangaPageModule {}
