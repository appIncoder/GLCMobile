
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, 
  IonListHeader, IonMenuToggle, IonItem, IonIcon, 
  IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { h } from 'ionicons/dist/types/stencil-public-runtime';
import { 
  archiveOutline, archiveSharp, 
  homeOutline, homeSharp,
  manOutline, manSharp,
  calendarOutline, calendarSharp,
  heartHalfOutline, heartHalfSharp,
  videocamOutline, videocamSharp,
  peopleOutline, peopleSharp,
  handLeftOutline, handLeftSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Accueil', url: '/accueil', icon: 'home' },
    { title: 'Pasteur', url: '/pasteur', icon: 'man' },
    { title: 'Agenda', url: '/agenda', icon: 'calendar' },
    { title: 'Activités', url: '/activites', icon: 'archive' },
    { title: 'Kalukalanga', url: '/kalukalanga', icon: 'heart-half' },
    { title: 'GLC Media', url: '/glcmedia', icon: 'videocam' },
    { title: 'Nous rejoindre', url: '/nousjoindre', icon: 'people' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    addIcons({ 
      archiveOutline, archiveSharp, 
      homeOutline, homeSharp,
      manOutline, manSharp,
      calendarOutline, calendarSharp,
      heartHalfOutline, heartHalfSharp,
      videocamOutline, videocamSharp,
      peopleOutline, peopleSharp,
      handLeftOutline, handLeftSharp });
  }
}
