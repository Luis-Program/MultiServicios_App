import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { EmployeeGuard } from 'src/app/guards/employee.guard';
import { ErrorComponent } from 'src/app/pages/error/error.component';
import { ProfileComponent } from '../shared/pages/profile/profile.component';
import { TelefonoComponent } from '../shared/pages/telefono/telefono.component';
import { NavSideBarComponent } from './../shared/components/nav-side-bar/nav-side-bar.component';
import { HomeComponent } from './../shared/pages/home/home.component';
import { RepuestoComponent } from './../shared/pages/repuesto/repuesto.component';
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
        canActivate: [EmployeeGuard, MsalGuard]
      },
      {
        path: 'repuesto',
        component: RepuestoComponent,
        canActivate: [EmployeeGuard, MsalGuard]
      },
      {
        path: 'servicio',
        component: ServicioComponent,
        canActivate: [EmployeeGuard, MsalGuard]
      },
      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [EmployeeGuard, MsalGuard]
      },
      {
        path: 'telefono',
        component: TelefonoComponent,
        canActivate: [EmployeeGuard, MsalGuard]
      },
      {
        path: 'error/:type',
        component: ErrorComponent,
        canActivate: [EmployeeGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
