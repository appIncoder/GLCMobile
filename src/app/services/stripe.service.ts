import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    Stripe: any;
  }
}

// ⬇️ Adapter à ce que renvoie ton PHP
// echo json_encode([
//   'client_secret' => $paymentIntent->client_secret,
//   'payment_intent_id' => $paymentIntent->id,
//   'status' => 'created',
// ]);
export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  status: string;
}

export interface PaymentMethodData {
  type: string;
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: any;
  private elements: any;
  private cardElement: any;

  // ⚠️ Assure-toi que environment.apiUrl = 'https://glcbaudour.be/api'
  private readonly BACKEND_URL = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.initializeStripe();
  }

  private initializeStripe() {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      console.log('Stripe.js loaded');
    };
    document.head.appendChild(script);
  }

  /**
   * Create a payment intent on the backend
   */
  createPaymentIntent(amount: number, currency: string = 'eur'): Observable<PaymentIntentResponse> {
    // ✅ On vise explicitement le fichier PHP
    const url = `${this.BACKEND_URL}/dons/payment-intent.php`;

    // ✅ On envoie le montant en euros (ton PHP convertit en centimes)
    const payload = {
      amount, // ex: 10 pour 10 €
      currency,
      metadata: {
        donation: true,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('Creating payment intent at:', url);
    console.log('Payload:', payload);
    
    return this.http.post<PaymentIntentResponse>(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
      // ⚠️ NE PAS mettre withCredentials ici tant que tu n’en as pas besoin
    });
  }

  /**
   * Confirm payment with Stripe
   * (à adapter plus tard avec ta vraie clé publique, pk_test en dev)
   */
  async confirmPayment(clientSecret: string, paymentMethod: any): Promise<any> {
    if (!window.Stripe) {
      throw new Error('Stripe.js not loaded');
    }

    const stripe = window.Stripe('pk_live_YOUR_PUBLISHABLE_KEY'); // TODO: pk_test en dev
    
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  }

  async createPaymentMethod(cardData: any): Promise<any> {
    if (!window.Stripe) {
      throw new Error('Stripe.js not loaded');
    }

    const stripe = window.Stripe('pk_live_YOUR_PUBLISHABLE_KEY');
    
    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: cardData
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentMethod;
  }

  setupCardElement(elementId: string): void {
    if (!window.Stripe) {
      console.error('Stripe.js not loaded');
      return;
    }
    // TODO: implémenter le Stripe Elements si tu veux un vrai champ carte
  }

  async handlePaymentSheetFlow(clientSecret: string): Promise<any> {
    if (!window.Stripe) {
      throw new Error('Stripe.js not loaded');
    }

    const stripe = window.Stripe('pk_live_YOUR_PUBLISHABLE_KEY');
    
    const result = await stripe.handleCardPayment(clientSecret);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  }
}
