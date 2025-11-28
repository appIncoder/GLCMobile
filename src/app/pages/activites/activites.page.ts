import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, 
  IonTitle, IonContent, IonButton, IonLabel, IonIcon,
IonItem, IonList, IonCardContent, IonCardSubtitle,
IonCardTitle, IonCard, IonCardHeader, IonModal } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
  import { notificationsOutline, notificationsSharp,
          timeOutline, timeSharp,
          callOutline, callSharp,
          personOutline, personSharp,
 } from 'ionicons/icons';

interface Activity {
  id: number;
  name: string;
  description: string;
  schedule: string;      // jours + heures
  responsible: string;   // personne responsable
  phone: string;         // numéro de téléphone
  planned: boolean;      // true = icône de notification
}

@Component({
  selector: 'app-activites',
  templateUrl: './activites.page.html',
  styleUrls: ['./activites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, 
    IonMenuButton, IonTitle, IonContent, IonButton, IonLabel, 
    IonIcon, IonItem, IonList, IonCardContent, IonCardSubtitle, 
    IonCardTitle, IonCardHeader, IonCard, IonModal],
})
export class ActivitesPage implements OnInit {

  constructor() {
        addIcons({ notificationsOutline, notificationsSharp,
                    timeOutline, timeSharp,
          callOutline, callSharp,
          personOutline, personSharp,
         });
  }

  // Liste mock d’activités du GLC Baudour
  activities: Activity[] = [
    {
      id: 1,
      name: 'Culte dominical',
      description: 'Culte hebdomadaire avec enseignement, louange et prière.',
      schedule: 'Tous les dimanches · 10h00 – 12h00',
      responsible: 'Pasteur Jean Dupont',
      phone: '+32 471 23 45 67',
      planned: true,
    },
    {
      id: 2,
      name: 'Réunion de prière',
      description: 'Temps de prière communautaire pour le GLC Baudour.',
      schedule: 'Tous les mardis · 19h30 – 21h00',
      responsible: 'Soeur Marie Martin',
      phone: '+32 496 11 22 33',
      planned: true,
    },
    {
      id: 3,
      name: 'Réunion de jeunes',
      description: 'Activités et enseignements pour les jeunes du GLC Baudour.',
      schedule: 'Tous les samedis · 18h00 – 20h00',
      responsible: 'Frère David Lambert',
      phone: '+32 488 55 66 77',
      planned: true,
    },
    {
      id: 4,
      name: 'Étude biblique',
      description: 'Étude approfondie des textes bibliques pour mieux comprendre la foi.',
      schedule: 'Tous les jeudis · 19h30 – 21h00',
      responsible: 'Frère Paul Leroy',
      phone: '+32 472 90 12 34',
      planned: false,
    },
    {
      id: 5,
      name: 'Répétition de louange',
      description: 'Réunion pour préparer les chants et la musique de louange.',
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
