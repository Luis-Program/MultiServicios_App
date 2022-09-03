import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    EquipoComponent,
    ServicioComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class ClientModule { }
