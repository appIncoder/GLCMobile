import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  IonCardTitle,
  IonCardHeader,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import type { RefresherCustomEvent } from '@ionic/angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Swiper web components
import { register } from 'swiper/element/bundle';
register();

interface PasteurItem {
  id: number;
  title: string;
  image: string;
  text: string; // HTML (<br>...)
}

@Component({
  selector: 'app-pasteur',
  templateUrl: './pasteur.page.html',
  styleUrls: ['./pasteur.page.scss'],
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
    IonImg,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonRefresher,
    IonRefresherContent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PasteurPage implements OnInit {
  public folder!: string;

  pasteurList: PasteurItem[] = [];
  isLoading = false;
  error?: string;

  activeIndex = 0;

  private activatedRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadPasteur();
  }

  ionViewWillEnter() {
    this.loadPasteur();
  }

  async doRefresh(event: RefresherCustomEvent) {
    try {
      await this.loadPasteur(true);
    } finally {
      event.target.complete();
    }
  }

  /** Texte HTML sécurisé pour l'affichage via [innerHTML] */
  safeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html ?? '');
  }

  /** Appelé par (slidechange) sur swiper-container */
  onSwiperSlideChange(ev: any) {
    // swiper web component: ev.detail[0] = instance Swiper
    const swiper = ev?.detail?.[0];
    const idx = swiper?.activeIndex;
    if (typeof idx === 'number') this.activeIndex = idx;
  }

  private loadPasteur(force = false): Promise<void> {
    this.isLoading = !force;
    this.error = undefined;

    const url = force
      ? `https://glcbaudour.be/api/pasteur?ts=${Date.now()}`
      : `https://glcbaudour.be/api/pasteur`;

    return new Promise((resolve) => {
      this.http.get<PasteurItem[] | any>(url).subscribe({
        next: (data) => {
          if (Array.isArray(data)) this.pasteurList = data;
          else if (data && Array.isArray(data.items)) this.pasteurList = data.items;
          else if (data && Array.isArray(data.data)) this.pasteurList = data.data;
          else if (data && Array.isArray(data.activities)) this.pasteurList = data.activities;
          else this.pasteurList = [];

          this.activeIndex = 0;
          this.isLoading = false;
          resolve();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du pasteur', err);
          this.error = 'Impossible de charger la page du pasteur pour le moment.';
          this.isLoading = false;
          resolve();
        },
      });
    });
  }
}
