import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full',
  },
  {
    path: 'accueil',
    loadComponent: () => 
      import('./pages/accueil/accueil.page').then( m => m.AccueilPage)
  },
  {
    path: 'pasteur',
    loadComponent: () => import('./pages/pasteur/pasteur.page').then( m => m.PasteurPage)
  },
  {
    path: 'agenda',
    loadComponent: () => import('./pages/agenda/agenda.page').then( m => m.AgendaPage)
  },
  {
    path: 'activites',
    loadComponent: () => import('./pages/activites/activites.page').then( m => m.ActivitesPage)
  },
  {
    path: 'kalukalanga',
    loadComponent: () => import('./pages/kalukalanga/kalukalanga.page').then( m => m.KalukalangaPage)
  },
  {
    path: 'nousjoindre',
    loadComponent: () => import('./pages/nousjoindre/nousjoindre.page').then( m => m.NousjoindrePage)
  },
  {
    path: 'glcmedia',
    loadComponent: () => import('./pages/glcmedia/glcmedia.page').then( m => m.GlcmediaPage)
  },
  {
    path: 'soutenir',
    loadComponent: () => import('./pages/soutenir/soutenir.page').then( m => m.SoutenirPage)
  },
];
