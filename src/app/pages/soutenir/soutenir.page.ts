import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonButton, IonImg, IonCardContent, IonCard, IonModal, IonGrid, IonRow, IonCol,
  IonSpinner
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
  selector: 'app-soutenir',
  templateUrl: './soutenir.page.html',
  styleUrls: ['./soutenir.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    IonButton, IonImg, IonCardContent, IonCard, IonModal, IonGrid, IonRow, IonCol,
    IonSpinner
  ],
})
export class SoutenirPage implements OnInit {
  private readonly apiUrl = 'https://glcbaudour.be/api/soutenir/';

  // ✅ Contenu dynamique (fallbacks)
  pageTitle = 'Soutenir le GLC Baudour';
  heroImageUrl = '';
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
    { amount: 200, label: '200€' },
    { amount: 300, label: '300€' },
  ];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadPageContent();
  }

  loadPageContent(forceRefresh = false) {
    this.isLoadingContent = true;
    this.contentError = null;

    const url = forceRefresh ? `${this.apiUrl}?ts=${Date.now()}` : this.apiUrl;

    this.http.get<ApiResponse<ActivityDto>>(url)
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
          console.error('Erreur chargement contenu soutenir:', err);
          this.contentError = "Impossible de charger le contenu pour le moment.";
        }
      });
  }

  // ✅ Ouverture page don externe (Apple-friendly)
  async openDonationPage(amount?: number | null) {
    const baseUrl = 'https://glcbaudour.be/don/';
    const url = amount && amount > 0
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
      this.paymentErrorMessage = e?.message ?? 'Impossible d’ouvrir la page de don.';
    } finally {
      this.isProcessingPayment = false;
    }
  }
}
