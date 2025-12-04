import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonIcon,
  IonItem,
  IonList,
  IonCardContent,
  IonCardTitle,
  IonCard,
  IonCardHeader,
  IonModal,
  IonImg,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  notificationsSharp,
  timeOutline,
  timeSharp,
  callOutline,
  callSharp,
  personOutline,
  personSharp,
} from 'ionicons/icons';

interface Activity {
  id: number;
  name: string;
  description: string;
  schedule: string;
  responsible: string;
  phone: string;
  planned: boolean;
  image: string;
}

@Component({
  selector: 'app-activites',
  templateUrl: './activites.page.html',
  styleUrls: ['./activites.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonButton,
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonModal,
    IonImg,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActivitesPage implements OnInit {
  private readonly ACTIVITIES_API_URL = 'https://glcbaudour.be/api/activities';

  // ✅ URL image par défaut
  private readonly DEFAULT_IMAGE_URL =
    'https://glcbaudour.be/wp-content/uploads/2024/04/cropped-en-tete-2.png';

  activities: Activity[] = [];
  selectedActivity: Activity | null = null;

  isActivityModalOpen = false;

  isLoading = false;
  loadError: string | null = null;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(private http: HttpClient) {
    addIcons({
      notificationsOutline,
      notificationsSharp,
      timeOutline,
      timeSharp,
      callOutline,
      callSharp,
      personOutline,
      personSharp,
    });
  }

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities(): void {
    this.isLoading = true;
    this.loadError = null;

    this.http.get<{ data: Activity[] }>(this.ACTIVITIES_API_URL).subscribe({
      next: (res) => {
        const rawActivities = res?.data || [];

        // ✅ On injecte l’image par défaut si le champ image est vide / null / inexistant
        this.activities = rawActivities.map((a: any) => {
          const image =
            a?.image && String(a.image).trim() !== ''
              ? a.image
              : this.DEFAULT_IMAGE_URL;

          return {
            ...a,
            image,
          } as Activity;
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activités :', err);
        this.loadError =
          'Impossible de charger les activités pour le moment. Veuillez réessayer plus tard.';
        this.isLoading = false;
      },
    });
  }

  openActivityDetails(activity: Activity): void {
    this.selectedActivity = activity;
    this.isActivityModalOpen = true;
  }

  closeActivityDetails(): void {
    this.isActivityModalOpen = false;
    this.selectedActivity = null;
  }
}
