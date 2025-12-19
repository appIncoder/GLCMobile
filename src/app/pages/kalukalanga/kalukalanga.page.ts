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

import { StripeNativeService } from '../../services/stripe-native.service';

interface PaymentOption {
  amount: number;
  label: string;
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

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  doRefresh(event: RefresherCustomEvent) {
    this.resetPaymentState();
    event.target.complete();
  }

  private resetPaymentState() {
    this.isProcessingPayment = false;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';
    this.selectedAmount = null;
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
      // Tu peux éventuellement passer des infos donor si tu ajoutes un formulaire plus tard
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
      this.paymentErrorMessage = e?.message ?? 'Le paiement a échoué. Veuillez réessayer.';
    } finally {
      this.isProcessingPayment = false;
    }
  }
}
