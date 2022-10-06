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

  protected downloadReport(){
    let array: any = [
      ["id","Fecha Hora","Tipo Servicio","Estado","Prioridad","Nombre equipo","Modelo equipo",
      "Nombre cliente","DPI cliente","Empresa cliente","NIT empresa","Nombre trabajador",
      "DPI Trabajador","Fecha hora asignado trabajador","Fecha hora realizar","Fecha hora finalizado",],
    ];
    for (let index = 0; index < this.auditoriaServicios.length; index++) {
      let alter: any = [
        this.auditoriaServicios[index].idAuditoriaServicio,
        String(this.parseDate(this.auditoriaServicios[index].fechaHora)),
        this.auditoriaServicios[index].tipoServicio,
        this.auditoriaServicios[index].estado,
        this.auditoriaServicios[index].prioridad,
        this.auditoriaServicios[index].nombreEquipo,
        this.auditoriaServicios[index].modeloEquipo,
        this.auditoriaServicios[index].nombreCliente,
        this.auditoriaServicios[index].dpiCliente,
        this.auditoriaServicios[index].empresaCliente,
        this.auditoriaServicios[index].empresaClienteNit,
        this.auditoriaServicios[index].nombreTrabajador ? this.auditoriaServicios[index].nombreTrabajador : 'No ingresado',
        this.auditoriaServicios[index].dpiTrabajador ? this.auditoriaServicios[index].dpiTrabajador : 'No ingresado',
        String(this.parseDate(this.auditoriaServicios[index].fechaHoraAsignadoTrabajador)),
        String(this.parseDate(this.auditoriaServicios[index].fechaHoraRealizar)),
        String(this.parseDate(this.auditoriaServicios[index].fechaHoraFinalizado)),
      ]
      array.push(alter);
    }

    let CsvString = "";
    array.forEach((RowItem:any) => {
      RowItem.forEach((colItem:any) => {
        CsvString += colItem + ',';
      });
      CsvString += '\r\n';
    })
    CsvString = "data:applications/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(CsvString);
    let x = document.createElement("A");
    x.setAttribute("href", CsvString);
    x.setAttribute("download","auditoria-servicio.csv")
    document.body.appendChild(x);
    x.click();
  }

  private parseDate(date:Date | null){
    return date ? formatDate(date,'medium','es').replace(",",'') : 'No ingresado';
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

  protected openModal(auditoria: Auditoria_servicio) {
    this.initForm();
    this.clearInput();
    this.setForm(auditoria);
  }

  private initForm() {
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
      observaciones               : [''],
      idAuditoriaServicio         : [''],
      idServicio                  : [''],
      nombreCliente               : [''],
      nombreEquipo                : [''],
      nombreTrabajador            : [''],
      prioridad                   : [''],
      tipoServicio                : [''],
    })
  }

  private setForm(auditoria: Auditoria_servicio) {
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
      observaciones: auditoria.observaciones ? auditoria.observaciones : 'No ingresadas',
      nombreTrabajador: auditoria.nombreTrabajador ? auditoria.nombreTrabajador : 'No ingresado',
      prioridad: auditoria.prioridad,
      tipoServicio: auditoria.tipoServicio,
    })
  }
}


