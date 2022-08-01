import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AnalisisRepuestoComponent } from './pages/analisis-repuesto/analisis-repuesto.component';
import { AuditoriaServicioComponent } from './pages/auditoria-servicio/auditoria-servicio.component';
import { DepartamentoComponent } from './pages/departamento/departamento.component';
import { DireccionComponent } from './pages/direccion/direccion.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';
import { PaisComponent } from './pages/pais/pais.component';
import { TipoRepuestoComponent } from './pages/tipo-repuesto/tipo-repuesto.component';
import { TipoTelefonoComponent } from './pages/tipo-telefono/tipo-telefono.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { TipoPersonaComponent } from './pages/tipo-persona/tipo-persona.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { TelefonoComponent } from './pages/telefono/telefono.component';


@NgModule({
  declarations: [
    AnalisisRepuestoComponent,
    AuditoriaServicioComponent,
    DepartamentoComponent,
    DireccionComponent,
    EmpresaComponent,
    MunicipioComponent,
    PaisComponent,
    TipoRepuestoComponent,
    TipoTelefonoComponent,
    PersonaComponent,
    TipoPersonaComponent,
    EquipoComponent,
    ServicioComponent,
    TelefonoComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule { }
