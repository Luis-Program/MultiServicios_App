import { Component, OnInit } from '@angular/core';
import { Auditoria_servicio } from 'src/app/models/auditoria_servicio.model';
import { AuditoriaServicioService } from 'src/app/services/auditoria-servicio.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-auditoria-servicio',
  templateUrl: './auditoria-servicio.component.html',
  styleUrls: ['./auditoria-servicio.component.css']
})
export class AuditoriaServicioComponent implements OnInit {

  protected auditoriaServicios: Auditoria_servicio[] = [];
  protected loading = false;
  protected filter = "";

  public Form!: FormGroup;

  constructor(
    private auditoriaServicioService: AuditoriaServicioService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllServiceAudit();
    this.initForm();
  }

  private getAllServiceAudit(){
    this.loading = true;
    this.auditoriaServicioService.getAll()
    .subscribe(servicesAudit => {
      this.auditoriaServicios = servicesAudit;
      this.loading = false;
    });
  }

  private clearInput() {
    this.filter = "";
  }

  openModal(auditoria: Auditoria_servicio) {
    this.initForm();
    this.clearInput();
    this.setForm(auditoria);
  }

  initForm() {
    this.Form = this.fb.group({
      dpiCliente                  : [''],
      dpiTrabajador               : [''],
      empresaCliente              : [''],
      empresaClienteNit           : [''],
      estado                      : [''],
      fechaHora                   : [''],
      fechaHoraAsignadoTrabajador : [''],
      fechaHoraCreado             : [''],
      fechaHoraFinalizado         : [''],
      fechaHoraRealizar           : [''],
      idAuditoriaServicio         : [''],
      idServicio                  : [''],
      nombreCliente               : [''],
      nombreEquipo                : [''],
      nombreTrabajador            : [''],
      prioridad                   : [''],
      tipoServicio                : [''],
    })
  }
// formatDate(Date(auditoria.fechaHoraCreado),'MMM d, y, h:mm:ss')
  setForm(auditoria: Auditoria_servicio) {
    this.Form.setValue({
      dpiCliente: auditoria.dpiCliente,
      dpiTrabajador: auditoria.dpiTrabajador ? auditoria.dpiTrabajador : 'No ingresado',
      empresaCliente: auditoria.empresaCliente,
      empresaClienteNit: auditoria.empresaClienteNit ? auditoria.empresaClienteNit : 'No ingresado',
      estado: auditoria.estado,
      fechaHora: formatDate(auditoria.fechaHora,'medium','es'),
      fechaHoraAsignadoTrabajador: auditoria.fechaHoraAsignadoTrabajador ? formatDate(auditoria.fechaHoraAsignadoTrabajador,'medium','es') : 'No ingresado',
      fechaHoraCreado: formatDate(auditoria.fechaHoraCreado,'medium','es'),
      fechaHoraFinalizado: auditoria.fechaHoraFinalizado ? formatDate(auditoria.fechaHoraFinalizado,'medium','es') : 'No ingresado',
      fechaHoraRealizar: auditoria.fechaHoraRealizar ? formatDate(auditoria.fechaHoraRealizar,'medium','es') : 'No ingresado',
      idAuditoriaServicio: auditoria.idAuditoriaServicio,
      idServicio: auditoria.idServicio,
      nombreCliente: auditoria.nombreCliente,
      nombreEquipo: auditoria.nombreEquipo,
      nombreTrabajador: auditoria.nombreTrabajador ? auditoria.nombreTrabajador : 'No ingresado',
      prioridad: auditoria.prioridad,
      tipoServicio: auditoria.tipoServicio,
    })
  }
}


