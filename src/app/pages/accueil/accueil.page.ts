import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonImg,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ActuItem {
  id: number;
  name?: string;
  image: string; // adapte ce nom si ton backend renvoie imageUrl
  link?: string;
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonImg,
    IonCard,
    IonCardContent,
    HttpClientModule,
  ],
})
export class AccueilPage implements OnInit {
  public folder!: string;

  // 🔹 Très important : tableau, pas objet
  actuList: ActuItem[] = [];
  isLoading = false;
  error?: string;

  private activatedRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);

  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadActu();
  }

  private loadActu() {
    this.isLoading = true;
    this.error = undefined;

    this.http.get<ActuItem[] | any>('https://glcbaudour.be/api/actu').subscribe({
      next: (data) => {
        console.log('Réponse API /api/actu =', data);

        // 🔹 Cas 1 : l’API renvoie directement un tableau
        if (Array.isArray(data)) {
          this.actuList = data;
        }
        // 🔹 Cas 2 : l’API renvoie un objet du type { items: [...] } ou { data: [...] }
        else if (data && Array.isArray(data.items)) {
          this.actuList = data.items;
        } else if (data && Array.isArray(data.data)) {
          this.actuList = data.data;
        } else {
          // Rien d’itérable -> on met un tableau vide
          console.warn('Format de réponse non supporté, actuList vide.');
          this.actuList = [];
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des actus', err);
        this.error = 'Impossible de charger les actualités pour le moment.';
        this.isLoading = false;
      },
    });
  }
}
