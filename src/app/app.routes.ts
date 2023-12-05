import { Routes } from '@angular/router';
import { CareersComponent } from './pages/careers/careers.component';
import { HomeComponent } from './pages/home/home.component';
import { WayToComponent } from './pages/way-to/way-to.component';
import { OffersComponent } from './pages/offers/offers.component';
import { UniComponent } from './pages/uni/uni.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'way-to', component: WayToComponent },
    { path: 'careers', component: CareersComponent },
    { path: 'offers', component: OffersComponent},
    { path: 'universidades', component: UniComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Ruta predeterminada
    { path: '**', redirectTo: '/home' }, // Redirige a la página de inicio para rutas desconocidas
];
