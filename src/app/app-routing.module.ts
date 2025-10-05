import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
{
path: '',
redirectTo: 'tabs/accueil',
pathMatch: 'full'
},
{
path: 'tabs',
loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
},


// Pages accessibles via le menu (hors tabs si besoin)
{
path: 'pages/mot-du-pasteur',
loadChildren: () => import('./pages/mot-du-pasteur/mot-du-pasteur.module').then(m => m.MotDuPasteurPageModule)
},
{
path: 'pages/ce-que-nous-croyons',
loadChildren: () => import('./pages/ce-que-nous-croyons/ce-que-nous-croyons.module').then(m => m.CeQueNousCroyonsPageModule)
},


// fallback
{ path: '**', redirectTo: 'tabs/accueil' }
];


@NgModule({
imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
exports: [RouterModule]
})
export class AppRoutingModule {}