import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';


const routes: Routes = [
{
path: '',
component: TabsPage,
children: [
{
path: 'accueil',
loadChildren: () => import('../accueil/accueil.module').then(m => m.AccueilPageModule)
},
{
path: 'agenda',
loadChildren: () => import('../agenda/agenda.module').then(m => m.AgendaPageModule)
},
{
path: 'a-venir',
loadChildren: () => import('../a-venir/a-venir.module').then(m => m.AVenirPageModule)
},
{
path: 'nous-rejoindre',
loadChildren: () => import('../nous-rejoindre/nous-rejoindre.module').then(m => m.NousRejoindrePageModule)
},
{
path: '',
redirectTo: 'accueil',
pathMatch: 'full'
}
]
}
];


@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class TabsPageRoutingModule {}