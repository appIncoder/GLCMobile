import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, 
  IonMenuButton, IonTitle, IonContent, 
  IonImg, IonCard, IonCardContent, IonCardTitle, IonCardHeader } from '@ionic/angular/standalone';


@Component({
  selector: 'app-pasteur',
  templateUrl: './pasteur.page.html',
  styleUrls: ['./pasteur.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, 
    IonMenuButton, IonTitle, IonContent,
    IonImg, IonCard, IonCardContent, IonCardTitle, IonCardHeader],
})
export class PasteurPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
