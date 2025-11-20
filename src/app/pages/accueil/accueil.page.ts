import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AccueilPage implements OnInit {

  constructor(private menuCtrl: MenuController) {}

  ngOnInit() { }

  async logAndToggle(ev?: Event) {
    try {
      // On s’assure que le menu avec l’ID 'main-menu' est bien activé
      await this.menuCtrl.enable(true, 'main-menu');

      // On toggle explicitement ce menu
      const res = await this.menuCtrl.toggle('main-menu');
    } catch (err) {
      console.error('[Accueil] menu toggle error:', err);
    }
  }

}
