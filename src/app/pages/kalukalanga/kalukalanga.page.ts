import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, 
  IonMenuButton, IonTitle, IonContent,
IonButton, IonImg, IonCardContent, IonCard, IonModal, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { StripeCardFormComponent } from '../../components/stripe-card-form/stripe-card-form.component';
import { StripeService } from '../../services/stripe.service';
import { HttpClientModule } from '@angular/common/http';

interface PaymentOption {
  amount: number;
  label: string;
}

@Component({
  selector: 'app-kalukalanga',
  templateUrl: './kalukalanga.page.html',
  styleUrls: ['./kalukalanga.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, 
    IonMenuButton, IonTitle, IonContent, IonButton, IonImg,
  IonCardContent, IonCard, IonModal, IonGrid, IonRow, IonCol, StripeCardFormComponent, HttpClientModule],
})
export class KalukalangaPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  private stripeService = inject(StripeService);
  
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

  private readonly BACKEND_API_URL = 'https://glcbaudour.be/api/dons';

  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
    this.selectedAmount = null;
  }

  selectAmount(amount: number) {
    this.selectedAmount = amount;
  }

  processPayment() {
    if (!this.selectedAmount) {
      console.warn('No amount selected');
      return;
    }

    console.log(`Starting payment process for ${this.selectedAmount}€`);
  }

  async handleCardPayment(cardData: any) {
    if (!this.selectedAmount) {
      this.paymentErrorMessage = 'Aucun montant sélectionné';
      return;
    }

    this.isProcessingPayment = true;
    this.paymentErrorMessage = '';
    this.paymentSuccessMessage = '';

    try {
      // Step 1: Create payment intent on backend
      console.log('Initiating payment for €' + this.selectedAmount);
      const paymentIntentResponse = await this.stripeService.createPaymentIntent(this.selectedAmount).toPromise();
      
      if (!paymentIntentResponse) {
        throw new Error('La réponse du serveur est vide');
      }

      console.log('Payment intent created:', paymentIntentResponse);

      this.paymentSuccessMessage = `Don de €${this.selectedAmount} traité avec succès!`;
      
      // Reset form after successful payment
      setTimeout(() => {
        this.closePaymentModal();
      }, 2000);

    } catch (error: any) {
      console.error('Payment error details:', error);
      
      // Extract more detailed error message
      let errorMsg = 'Le paiement a échoué. Veuillez réessayer.';
      
      if (error.status === 0) {
        errorMsg = 'Erreur de connexion: Impossible de joindre le serveur. Vérifiez votre connexion Internet.';
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      this.paymentErrorMessage = errorMsg;
    } finally {
      this.isProcessingPayment = false;
    }
  }
}


