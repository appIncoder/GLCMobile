import { Component, OnInit } from '@angular/core';
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
  IonCardSubtitle,
  IonCardTitle,
  IonCard,
  IonCardHeader,
  IonModal,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
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
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonModal,
  ],
})
export class ActivitesPage implements OnInit {
  private readonly ACTIVITIES_API_URL = 'https://glcbaudour.be/api/activities';

  activities: Activity[] = [];
  selectedActivity: Activity | null = null;
  isActivityModalOpen = false;

  isLoading = false;
  loadError: string | null = null;

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

  ngOnInit() {
    this.loadActivities();
  }

  private loadActivities() {
    this.isLoading = true;
    this.loadError = null;

    this.http.get<{ data: Activity[] }>(this.ACTIVITIES_API_URL).subscribe({
      next: (res) => {
        this.activities = res.data || [];
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
