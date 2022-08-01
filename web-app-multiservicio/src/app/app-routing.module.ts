import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ClientGuard } from './guards/client.guard';
import { EmployeeGuard } from './guards/employee.guard';
import { ManagerGuard } from './guards/manager.guard';
import { ErrorComponent } from './pages/error/error.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/website/website.module').then(m => m.WebsiteModule),
  },
  {
    path: 'gerente-general',
    loadChildren: () => import('./modules/manager/manager.module').then(m => m.ManagerModule),
    canActivate: [ManagerGuard, MsalGuard]
  },
  {
    path: 'cliente',
    loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule),
    canActivate: [ClientGuard, MsalGuard]
  },
  {
    path: 'trabajador',
    loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [EmployeeGuard, MsalGuard]
  },
  {
    path: 'error/:type',
    component: ErrorComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
