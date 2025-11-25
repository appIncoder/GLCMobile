import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// 🔹 IMPORTS POUR LA LOCALE FR
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// 🔹 ENREGISTRER LA LOCALE FR
registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // 🔹 DIRE À ANGULAR D'UTILISER LE FRANÇAIS PAR DÉFAUT
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
});
