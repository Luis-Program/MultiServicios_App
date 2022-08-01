import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerGuard } from 'src/app/guards/manager.guard';
import { ProfileComponent } from '../shared/pages/profile/profile.component';
import { TelefonoComponent } from './pages/telefono/telefono.component';
import { NavSideBarComponent } from './../shared/components/nav-side-bar/nav-side-bar.component';
import { AnalisisRepuestoComponent } from './pages/analisis-repuesto/analisis-repuesto.component';
import { AuditoriaServicioComponent } from './pages/auditoria-servicio/auditoria-servicio.component';
import { DepartamentoComponent } from './pages/departamento/departamento.component';
import { DireccionComponent } from './pages/direccion/direccion.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';
import { PaisComponent } from './pages/pais/pais.component';
import { RepuestoComponent } from './../shared/pages/repuesto/repuesto.component';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { TipoRepuestoComponent } from './pages/tipo-repuesto/tipo-repuesto.component';
import { TipoTelefonoComponent } from './pages/tipo-telefono/tipo-telefono.component';
import { HomeComponent } from './../shared/pages/home/home.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { ErrorComponent } from 'src/app/pages/error/error.component';
import { MsalGuard } from '@azure/msal-angular';
import { TipoPersonaComponent } from './pages/tipo-persona/tipo-persona.component';

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
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'analisis-repuesto',
        component: AnalisisRepuestoComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'auditoria-servicio',
        component: AuditoriaServicioComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'departamento',
        component: DepartamentoComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'direccion',
        component: DireccionComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'empresa',
        component: EmpresaComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'equipo',
        component: EquipoComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'municipio',
        component: MunicipioComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'pais',
        component: PaisComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'repuesto',
        component: RepuestoComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'servicio',
        component: ServicioComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'tipo-repuesto',
        component: TipoRepuestoComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'tipo-telefono',
        component: TipoTelefonoComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'tipo-persona',
        component: TipoPersonaComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'persona',
        component: PersonaComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'telefono',
        component: TelefonoComponent,
        canActivate: [ManagerGuard, MsalGuard]
      },
      {
        path: 'error/:type',
        component: ErrorComponent,
        canActivate: [ManagerGuard, MsalGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
