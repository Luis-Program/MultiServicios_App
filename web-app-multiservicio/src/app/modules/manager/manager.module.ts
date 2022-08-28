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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterNameCodePipe } from './pipes/filter-name-code.pipe';
import { FilterBusinessPipe } from './pipes/filter-business.pipe';
import { FilterPersonPipe } from './pipes/filter-person.pipe';
import { FilterTypePersonPipe } from './pipes/filter-type-person.pipe';
import { FilterTypePhoneReplacementPipe } from './pipes/filter-type-phone-replacement.pipe';
import { FilterDireccionPipe } from './pipes/filter-direccion.pipe';

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FilterAuditPipe } from './pipes/filter-audit.pipe';
import { FilterAnalysisPipe } from './pipes/filter-analysis.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
    TelefonoComponent,
    FilterNameCodePipe,
    FilterBusinessPipe,
    FilterPersonPipe,
    FilterTypePersonPipe,
    FilterTypePhoneReplacementPipe,
    FilterDireccionPipe,
    FilterAuditPipe,
    FilterAnalysisPipe,
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxChartsModule
  ]
})
export class ManagerModule { }
