import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, 
  IonMenuButton, IonTitle, IonContent, IonCardContent, 
  IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-nousjoindre',
  templateUrl: './nousjoindre.page.html',
  styleUrls: ['./nousjoindre.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, 
    IonMenuButton, IonTitle, IonContent, IonCardContent, 
    IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader],
})
export class NousjoindrePage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
