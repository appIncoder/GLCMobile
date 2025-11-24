import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

interface Activity {
  id: number;
  name: string;
  schedule: string;      // jours + heures
  responsible: string;   // personne responsable
  phone: string;         // numéro de téléphone
  planned: boolean;      // true = icône de notification
}

@Component({
  selector: 'app-a-venir',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './a-venir.page.html',
  styleUrls: ['./a-venir.page.scss'],
})
export class AVenirPage implements OnInit {

  constructor(private menuCtrl: MenuController) {}

  // Liste mock d’activités du GLC Baudour
  activities: Activity[] = [
    {
      id: 1,
      name: 'Culte dominical',
      schedule: 'Tous les dimanches · 10h00 – 12h00',
      responsible: 'Pasteur Jean Dupont',
      phone: '+32 471 23 45 67',
      planned: true,
    },
    {
      id: 2,
      name: 'Réunion de prière',
      schedule: 'Tous les mardis · 19h30 – 21h00',
      responsible: 'Soeur Marie Martin',
      phone: '+32 496 11 22 33',
      planned: true,
    },
    {
      id: 3,
      name: 'Réunion de jeunes',
      schedule: 'Tous les samedis · 18h00 – 20h00',
      responsible: 'Frère David Lambert',
      phone: '+32 488 55 66 77',
      planned: true,
    },
    {
      id: 4,
      name: 'Étude biblique',
      schedule: 'Tous les jeudis · 19h30 – 21h00',
      responsible: 'Frère Paul Leroy',
      phone: '+32 472 90 12 34',
      planned: false,
    },
    {
      id: 5,
      name: 'Répétition de louange',
      schedule: 'Un vendredi sur deux · 20h00 – 22h00',
      responsible: 'Soeur Anna Moreau',
      phone: '+32 489 33 44 55',
      planned: false,
    },
  ];

  // état du modal pour la fiche détaillée
  selectedActivity: Activity | null = null;
  isActivityModalOpen = false;

  ngOnInit() {}

  // Menu burger (inchangé)
  async logAndToggle(ev?: Event) {
    try {
      await this.menuCtrl.enable(true, 'main-menu');
      const res = await this.menuCtrl.toggle('main-menu');
    } catch (err) {
      console.error('[AVenir] menu toggle error:', err);
    }
  }

  // Ouvrir la fiche détaillée
  openActivityDetails(activity: Activity) {
    this.selectedActivity = activity;
    this.isActivityModalOpen = true;
  }

  // Fermer la fiche détaillée
  closeActivityDetails() {
    this.isActivityModalOpen = false;
  }

}
