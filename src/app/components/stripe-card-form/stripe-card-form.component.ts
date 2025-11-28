import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonButton, IonGrid, IonRow, IonCol, IonSpinner, IonText } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stripe-card-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonText
  ],
  template: `
    <ion-card>
      <ion-card-content>
        <form (ngSubmit)="onSubmit()">
          <!-- Card Number -->
          <div class="form-group">
            <label for="cardNumber">Numéro de carte</label>
            <input
              type="text"
              id="cardNumber"
              [(ngModel)]="cardData.number"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              maxlength="19"
              (input)="formatCardNumber($event)"
              [disabled]="isProcessing"
              class="card-input"
            />
          </div>

          <!-- Row: Expiry and CVC -->
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <div class="form-group">
                  <label for="expiry">MM / YYYY</label>
                  <input
                    type="text"
                    id="expiry"
                    [(ngModel)]="cardData.expiry"
                    name="expiry"
                    placeholder="MM / YYYY"
                    maxlength="9"
                    (input)="formatExpiry($event)"
                    [disabled]="isProcessing"
                    class="card-input"
                  />
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="form-group">
                  <label for="cvc">Code CVC</label>
                  <input
                    type="text"
                    id="cvc"
                    [(ngModel)]="cardData.cvc"
                    name="cvc"
                    placeholder="123"
                    maxlength="4"
                    (input)="formatCVC($event)"
                    [disabled]="isProcessing"
                    class="card-input"
                  />
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>

          <!-- Name -->
          <div class="form-group">
            <label for="cardName">Nom du titulaire</label>
            <input
              type="text"
              id="cardName"
              [(ngModel)]="cardData.name"
              name="cardName"
              placeholder="Jean Dupont"
              [disabled]="isProcessing"
              class="card-input"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="cardData.email"
              name="email"
              placeholder="jean@example.com"
              [disabled]="isProcessing"
              class="card-input"
            />
          </div>

          <!-- Error Message -->
          <ion-text color="danger" *ngIf="errorMessage" class="error-message">
            <p>{{ errorMessage }}</p>
          </ion-text>

          <!-- Success Message -->
          <ion-text color="success" *ngIf="successMessage" class="success-message">
            <p>{{ successMessage }}</p>
          </ion-text>

          <!-- Submit Button -->
          <ion-button
            expand="block"
            type="submit"
            [disabled]="isProcessing || !isFormValid()"
            color="primary"
            class="payment-btn"
          >
            <span *ngIf="!isProcessing">Payer €{{ amount }}</span>
            <span *ngIf="isProcessing">
              <ion-spinner name="circular" style="width: 20px; height: 20px; margin-right: 8px;"></ion-spinner>
              Traitement...
            </span>
          </ion-button>
        </form>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #ffffff;
    }

    .card-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #444;
      border-radius: 4px;
      font-size: 16px;
      background-color: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      font-family: 'Courier New', monospace;
    }

    .card-input::placeholder {
      color: #888;
    }

    .card-input:disabled {
      background-color: rgba(255, 255, 255, 0.02);
      color: #666;
      cursor: not-allowed;
    }

    .card-input:focus {
      outline: none;
      border-color: #3880ff;
      box-shadow: 0 0 0 2px rgba(56, 128, 255, 0.1);
    }

    .error-message {
      padding: 12px;
      border-radius: 4px;
      background-color: rgba(255, 76, 76, 0.1);
      margin-bottom: 16px;
    }

    .success-message {
      padding: 12px;
      border-radius: 4px;
      background-color: rgba(76, 175, 80, 0.1);
      margin-bottom: 16px;
    }

    .payment-btn {
      margin-top: 20px;
      font-weight: 600;
    }

    form {
      margin: 0;
    }

    ion-spinner {
      display: inline-block;
    }
  `]
})
export class StripeCardFormComponent implements OnInit {
  @Input() amount: number = 10;
  @Output() paymentSubmit = new EventEmitter<any>();

  isProcessing = false;
  errorMessage: string = '';
  successMessage: string = '';

  cardData = {
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    email: ''
  };

  ngOnInit() {
    // Component initialization
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }

    this.cardData.number = formattedValue;
    event.target.value = formattedValue;
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + ' / ' + value.slice(2, 6);
    }

    this.cardData.expiry = value;
    event.target.value = value;
  }

  formatCVC(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    this.cardData.cvc = value.slice(0, 4);
    event.target.value = this.cardData.cvc;
  }

  isFormValid(): boolean {
    return this.cardData.number.replace(/\s/g, '').length >= 13 &&
           this.cardData.expiry.length >= 7 &&
           this.cardData.cvc.length >= 3 &&
           this.cardData.name.trim().length > 0 &&
           this.cardData.email.includes('@');
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Emit the card data to parent component
      this.paymentSubmit.emit(this.cardData);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.successMessage = 'Paiement traité avec succès!';
      this.resetForm();
    } catch (error: any) {
      this.errorMessage = error.message || 'Le paiement a échoué. Veuillez réessayer.';
    } finally {
      this.isProcessing = false;
    }
  }

  private resetForm() {
    this.cardData = {
      number: '',
      expiry: '',
      cvc: '',
      name: '',
      email: ''
    };
  }
}
