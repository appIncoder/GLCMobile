import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import type { RefresherCustomEvent } from '@ionic/angular';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
  IonCardContent,
  IonCard,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/angular/standalone';

import { Browser } from '@capacitor/browser';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface PaymentOption {
  amount: number;
  label: string;
}

interface ActivityDto {
  id?: number;
  title?: string;
  image?: string;
  text?: string; // HTML
}

interface ApiResponse<T> {
  data: T[];
  count: number;
}

@Component({
  selector: 'app-kalukalanga',
  templateUrl: './kalukalanga.page.html',
  styleUrls: ['./kalukalanga.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,

    IonRefresher,
    IonRefresherContent,

    IonButton,
    IonImg,
    IonCardContent,
    IonCard,
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
  ],
})
export class KalukalangaPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  // ✅ API
  private readonly apiUrl = 'https://glcbaudour.be/api/kalukalanga';

  // ✅ Contenu dynamique (fallbacks)
  pageTitle = 'La mission Kalukalanga';
  heroImageUrl =
    'https://glcbaudour.be/wp-content/uploads/2024/12/WhatsApp-Image-2024-11-27-a-10.16.27_1a955f7a.jpg';
  pageHtml: SafeHtml = '';
  isLoadingContent = false;
  contentError: string | null = null;

  // ✅ Modal Don
  isPaymentModalOpen = false;
  selectedAmount: number | null = null;

  isProcessingPayment = false;
  paymentErrorMessage = '';
  paymentSuccessMessage = '';

  paymentOptions: PaymentOption[] = [
    { amount: 5, label: '5€' },
    { amount: 10, label: '10€' },
    { amount: 20, label: '20€' },
    { amount: 50, label: '50€' },
    { amount: 100, label: '100€' },
  ];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadPageContent();
  }

  loadPageContent(forceRefresh = false) {
    this.isLoadingContent = true;
    this.contentError = null;

    const url = forceRefresh ? `${this.apiUrl}?ts=${Date.now()}` : this.apiUrl;

    this.http
      .get<ApiResponse<ActivityDto>>(url)
      .pipe(finalize(() => (this.isLoadingContent = false)))
      .subscribe({
        next: (res) => {
          const item = res?.data?.[0];
          if (!item) {
            this.contentError = 'Contenu indisponible.';
            return;
          }

          if (item.title) this.pageTitle = item.title;
          if (item.image) this.heroImageUrl = item.image;

          const html = item.text ?? '';
          this.pageHtml = this.sanitizer.bypassSecurityTrustHtml(html);
        },
        error: (err) => {
          console.error('Erreur chargement contenu kalukalanga:', err);
          this.contentError = "Impossible de charger le contenu pour le moment.";
        },
      });
  }

  doRefresh(event: RefresherCustomEvent) {
    this.resetPaymentState();
    this.loadPageContent(true);
    event.target.complete();
  }

  private resetPaymentState() {
    this.isProcessingPayment = false;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';
    this.selectedAmount = null;
  }

  async openDonationPage(amount?: number | null) {
    const baseUrl = 'https://glcbaudour.be/don/';
    const url =
      amount && amount > 0
        ? `${baseUrl}?amount=${encodeURIComponent(String(amount))}`
        : baseUrl;

    await Browser.open({ url });
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;
    this.selectedAmount = null;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';
    this.isProcessingPayment = false;
  }

  closePaymentModal() {
    if (this.isProcessingPayment) return;
    this.isPaymentModalOpen = false;
    this.selectedAmount = null;
    this.isProcessingPayment = false;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';
  }

  selectAmount(amount: number) {
    if (this.isProcessingPayment) return;
    this.selectedAmount = amount;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';
  }

  async payNow() {
    if (!this.selectedAmount || this.isProcessingPayment) return;

    this.isProcessingPayment = true;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';

    try {
      await this.openDonationPage(this.selectedAmount);
      this.closePaymentModal();
    } catch (e: any) {
      this.paymentErrorMessage =
        e?.message ?? 'Impossible d’ouvrir la page de don.';
    } finally {
      this.isProcessingPayment = false;
    }
  }
}
