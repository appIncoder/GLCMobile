import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonButton, IonImg, IonCardContent, IonCard, IonModal, IonGrid, IonRow, IonCol,
  IonSpinner
} from '@ionic/angular/standalone';

// ⚠️ Remplace ton StripeService (Stripe.js) par un service natif Capacitor Stripe
import { StripeNativeService } from '../../services/stripe-native.service';

interface PaymentOption {
  amount: number;
  label: string;
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
  private stripeNative = inject(StripeNativeService);

  isPaymentModalOpen = false;
  selectedAmount: number | null = null;

  isProcessingPayment = false;
  paymentErrorMessage = '';
  paymentSuccessMessage = '';

  paymentOptions: PaymentOption[] = [
    { amount: 1, label: '1€' },
    { amount: 2, label: '2€' },
    { amount: 5, label: '5€' },
    { amount: 10, label: '10€' },
    { amount: 20, label: '20€' },
  ];

  ngOnInit() {}

  openPaymentModal() {
    this.isPaymentModalOpen = true;
    this.selectedAmount = null;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';
    this.isProcessingPayment = false;
  }

  closePaymentModal() {
    if (this.isProcessingPayment) return; // évite de fermer pendant Stripe UI
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
      const res = await this.stripeNative.payDonation(this.selectedAmount);

      if (res.status === 'succeeded') {
        this.paymentSuccessMessage = `Merci ! Votre don de €${this.selectedAmount} a été effectué.`;
        setTimeout(() => this.closePaymentModal(), 1500);
        return;
      }

      if (res.status === 'canceled') {
        this.paymentErrorMessage = 'Paiement annulé.';
        return;
      }

      this.paymentErrorMessage = 'Le paiement a échoué. Veuillez réessayer.';
    } catch (e: any) {
      this.paymentErrorMessage =
        e?.message ?? 'Le paiement a échoué. Veuillez réessayer.';
    } finally {
      this.isProcessingPayment = false;
    }
  }
}
