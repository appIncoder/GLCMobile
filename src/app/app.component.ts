
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, 
        paperPlaneOutline, paperPlaneSharp, 
        heartOutline, heartSharp, 
        archiveOutline, archiveSharp, 
        trashOutline, trashSharp, 
        warningOutline, warningSharp, 
        bookmarkOutline, bookmarkSharp, 
        peopleOutline, peopleSharp,
        homeOutline, homeSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Accueil', url: '/accueil', icon: 'home' },
    { title: 'Le Pasteur', url: '/pasteur', icon: 'paper-plane' }, 
    { title: 'A venir', url: '/avenir', icon: 'heart' },
    { title: 'Agenda GLC', url: '/agenda', icon: 'archive' },
    { title: 'Ce que nous croyons', url: '/nouscroyons', icon: 'trash' },
    { title: 'Mission Kalukalanga', url: '/kalukalanga', icon: 'people' },
    { title: 'GLC Media', url: '/glcmedia', icon: 'people' },
    { title: 'Pour nous rejoindre', url: '/nousrejoindre', icon: 'people' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    addIcons({ mailOutline, 
      mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, 
      heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, 
      warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, 
      peopleOutline,peopleSharp, homeOutline, homeSharp });
  }
}
