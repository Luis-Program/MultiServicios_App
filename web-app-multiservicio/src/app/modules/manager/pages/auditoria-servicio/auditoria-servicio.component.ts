import { Component, OnInit } from '@angular/core';
import { Auditoria_servicio } from 'src/app/models/auditoria_servicio.model';
import { AuditoriaServicioService } from 'src/app/services/auditoria-servicio.service';

@Component({
  selector: 'app-auditoria-servicio',
  templateUrl: './auditoria-servicio.component.html',
  styleUrls: ['./auditoria-servicio.component.css']
})
export class AuditoriaServicioComponent implements OnInit {

  protected auditoriaServicio: Auditoria_servicio | null = null;
  protected auditoriaServicios: Auditoria_servicio[] = [];
  protected loading = false;

  constructor(
    private auditoriaServicioService: AuditoriaServicioService
  ) { }

  ngOnInit(): void {
    this.getAllServiceAudit();
    // this.loadData();
  }

  private getAllServiceAudit(){
    this.loading = true;
    this.auditoriaServicioService.getAll()
    .subscribe(servicesAudit => {
      this.auditoriaServicios = servicesAudit;
      this.loading = false;
    });
  }

  protected getOneServiceAudit(idAuditoriaServicio: number){
    this.auditoriaServicio = this.auditoriaServicios.find(serviceAudit => serviceAudit.idAuditoriaServicio = idAuditoriaServicio) as Auditoria_servicio;
    if (this.auditoriaServicio) {
      // show content
    }
  }

  private loadData(){
    this.auditoriaServicios.push({
      idAuditoriaServicio: 1,
      fechaHora: new Date("2022-02-01"),
      idServicio: 1,
      tipoServicio: 'Preventivo',
      prioridad: 'Alta',
      nombreEquipo: 'equipo1',
      nombreCliente: 'cliente1',
      dpiCliente: '164632',
      fechaHoraCreado: new Date("2021-02-03"),
      empresaCliente: 'Empresa1',
      empresaClienteNit: '1321654651',
      fechaHoraFinalizado: new Date("2021-01-01"),
      estado: '',
      nombreTrabajador: null,
      dpiTrabajador: null,
      fechaHoraAsignadoTrabajador: null,
      fechaHoraRealizar: null
    });
  }
}
