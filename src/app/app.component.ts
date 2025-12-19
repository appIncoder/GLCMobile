
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, 
  IonListHeader, IonMenuToggle, IonItem, IonIcon, 
  IonLabel, IonRouterOutlet, IonRouterLink,
  IonToggle } from '@ionic/angular/standalone';
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
  handLeftOutline, handLeftSharp, 
  moonOutline, moonSharp,
  sunnyOutline, sunnySharp} from 'ionicons/icons';
import { ThemeService } from './services/theme.service';
import { Stripe } from '@capacitor-community/stripe';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, 
    IonSplitPane, IonMenu, IonContent, IonList, 
    IonListHeader, IonMenuToggle, IonItem, 
    IonIcon, IonLabel, IonRouterLink, IonRouterOutlet,
   IonToggle],
})
export class AppComponent {
  isDark = true;

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
  constructor(private themeService: ThemeService) {
    addIcons({ 
      archiveOutline, archiveSharp, 
      homeOutline, homeSharp,
      manOutline, manSharp,
      calendarOutline, calendarSharp,
      heartHalfOutline, heartHalfSharp,
      videocamOutline, videocamSharp,
      peopleOutline, peopleSharp,
      handLeftOutline, handLeftSharp,
      moonOutline, moonSharp,
      sunnyOutline, sunnySharp });

      Stripe.initialize({
      publishableKey: environment.stripePublishableKey, // pk_live_...
    });
  }

  onInit() {
    this.onThemeToggle(new CustomEvent('toggle', { detail: { checked: this.themeService.isDarkMode() } })); 
  } 

  onThemeToggle(ev: CustomEvent) {
    const checked = (ev.detail as any).checked;
    this.isDark = checked;
    if (checked) {
      this.themeService.setDarkMode();
    } else {
      this.themeService.setLightMode();
    }
  }
}
