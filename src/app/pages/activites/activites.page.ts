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
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';

import type { RefresherCustomEvent } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

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

    // ✅ refresher
    IonRefresher,
    IonRefresherContent,

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

  // ✅ Pull-to-refresh (swipe de haut en bas)
  doRefresh(event: RefresherCustomEvent) {
    this.loadActivities(true, event);
  }

  private loadActivities(
    forceRefresh = false,
    refresherEvent?: RefresherCustomEvent
  ): void {
    // Si c'est un pull-to-refresh, évite de montrer un "gros loading" global
    this.isLoading = !refresherEvent;
    this.loadError = null;

    const url = forceRefresh
      ? `${this.ACTIVITIES_API_URL}?ts=${Date.now()}`
      : this.ACTIVITIES_API_URL;

    this.http
      .get<{ data: Activity[] }>(url)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (refresherEvent) refresherEvent.target.complete(); // stop animation
        })
      )
      .subscribe({
        next: (res) => {
          const rawActivities = res?.data || [];

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
        },
        error: (err) => {
          console.error('Erreur lors du chargement des activités :', err);
          this.loadError =
            'Impossible de charger les activités pour le moment. Veuillez réessayer plus tard.';
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
