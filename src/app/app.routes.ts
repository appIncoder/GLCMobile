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
      import('./pages/accueil/accueil.page').then((m) => m.AccueilPage),
  },
    {
    path: 'pasteur',
    loadComponent: () =>
      import('./pages/mot-du-pasteur/mot-du-pasteur.page').then((m) => m.MotDuPasteurPage),
  },
    {
    path: 'avenir',
    loadComponent: () =>
      import('./pages/a-venir/a-venir.page').then((m) => m.AVenirPage),
  },
    {
    path: 'agenda',
    loadComponent: () =>
      import('./pages/agenda/agenda.page').then((m) => m.AgendaPage),
  },
    {
    path: 'nouscroyons',
    loadComponent: () =>
      import('./pages/ce-que-nous-croyons/ce-que-nous-croyons.page').then((m) => m.CeQueNousCroyonsPage),
  },
    {
    path: 'nousrejoindre',
    loadComponent: () =>
      import('./pages/nous-rejoindre/nous-rejoindre.page').then((m) => m.NousRejoindrePage),
  },
    {
    path: 'kalukalanga',
    loadComponent: () =>
      import('./pages/kalukalanga/kalukalanga.page').then((m) => m.KalukalangaPage),
  },
    {
    path: 'glcmedia',
    loadComponent: () =>
      import('./pages/glcmedia/glcmedia.page').then((m) => m.GlcmediaPage),
  },
];
