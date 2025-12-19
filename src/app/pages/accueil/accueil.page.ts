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
  IonCardContent, IonRefresherContent, IonRefresher } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import type { RefresherCustomEvent } from '@ionic/angular';

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
  imports: [IonRefresher, IonRefresherContent, 
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

  ionViewWillEnter() {
    this.loadActu();
  }

  ngOnInit() {
    this.loadActu();
  }

  async doRefresh(event: RefresherCustomEvent) {
    try {
      await this.loadActu(true); // true => force refresh
    } finally {
      event.target.complete(); // stop l’animation du refresher
    }
  }

  private loadActu(force = false): Promise<void> {
    this.isLoading = !force; // évite double spinner si pull-to-refresh
    this.error = undefined;

    const url = force
      ? `https://glcbaudour.be/api/actu?ts=${Date.now()}`
      : `https://glcbaudour.be/api/actu`;

    return new Promise((resolve) => {
      this.http.get<ActuItem[] | any>(url).subscribe({
        next: (data) => {
          if (Array.isArray(data)) this.actuList = data;
          else if (data && Array.isArray(data.items)) this.actuList = data.items;
          else if (data && Array.isArray(data.data)) this.actuList = data.data;
          else this.actuList = [];
          this.isLoading = false;
          resolve();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des actus', err);
          this.error = 'Impossible de charger les actualités pour le moment.';
          this.isLoading = false;
          resolve(); // on resolve quand même pour arrêter le refresher
        },
      });
    });
  }
}
