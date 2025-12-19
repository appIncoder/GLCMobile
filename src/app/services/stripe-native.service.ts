import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Stripe, PaymentSheetEventsEnum } from '@capacitor-community/stripe';
import { environment } from '../../environments/environment';

type PaymentSheetServerResponse = {
  paymentIntent: string; // client_secret
  customer: string;      // customerId
  ephemeralKey: string;  // ephemeralKeySecret
};

@Injectable({ providedIn: 'root' })
export class StripeNativeService {
  constructor(private http: HttpClient) {}

  async payDonation(amountEuro: number, donor?: { name?: string; email?: string; message?: string }) {
    // 1) Récupérer les infos depuis TON backend (payment-sheet.php)
    const url = `${environment.apiUrl}/dons/payment-sheet.php`;

    const serverData = await firstValueFrom(
      this.http.post<PaymentSheetServerResponse>(url, {
        amount: amountEuro,
        donor_name: donor?.name ?? null,
        donor_email: donor?.email ?? null,
        message: donor?.message ?? null,
      })
    );

    // 2) Préparer PaymentSheet
    await Stripe.createPaymentSheet({
      paymentIntentClientSecret: serverData.paymentIntent,
      customerId: serverData.customer,
      customerEphemeralKeySecret: serverData.ephemeralKey,
      merchantDisplayName: 'GLC Baudour',
      // returnURL utile pour certains flows / Android (si besoin)
      // returnURL: 'glcbaudour://stripe-redirect',
    });

    // 3) Afficher PaymentSheet (Stripe gère l’UI + validation carte)
    const { paymentResult } = await Stripe.presentPaymentSheet();

    if (paymentResult === PaymentSheetEventsEnum.Completed) {
      return { status: 'succeeded' as const };
    }
    if (paymentResult === PaymentSheetEventsEnum.Canceled) {
      return { status: 'canceled' as const };
    }
    return { status: 'failed' as const };
  }
}
