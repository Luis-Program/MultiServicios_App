import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ClientGuard } from 'src/app/guards/client.guard';
import { ErrorComponent } from 'src/app/pages/error/error.component';
import { ProfileComponent } from '../shared/pages/profile/profile.component';
import { TelefonoComponent } from '../shared/pages/telefono/telefono.component';
import { NavSideBarComponent } from './../shared/components/nav-side-bar/nav-side-bar.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { HomeComponent } from './../shared/pages/home/home.component';
import { ServicioComponent } from './pages/servicio/servicio.component';

const routes: Routes = [
  {
    path: '',
    component: NavSideBarComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [ClientGuard, MsalGuard]
      },
      {
        path: 'equipo',
        component: EquipoComponent,
        canActivate: [ClientGuard, MsalGuard]
      },
      {
        path: 'servicio',
        component: ServicioComponent,
        canActivate: [ClientGuard, MsalGuard]
      },
      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [ClientGuard, MsalGuard]
      },
      {
        path: 'telefono',
        component: TelefonoComponent,
        canActivate: [ClientGuard, MsalGuard]
      },
      {
        path: 'error/:type',
        component: ErrorComponent,
        canActivate: [ClientGuard, MsalGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
