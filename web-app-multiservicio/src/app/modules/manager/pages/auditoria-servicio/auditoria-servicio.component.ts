import { Component, OnInit } from '@angular/core';
import { Auditoria_servicio } from 'src/app/models/auditoria_servicio.model';
import { AuditoriaServicioService } from 'src/app/services/auditoria-servicio.service';

@Component({
  selector: 'app-auditoria-servicio',
  templateUrl: './auditoria-servicio.component.html',
  styleUrls: ['./auditoria-servicio.component.css']
})
export class AuditoriaServicioComponent implements OnInit {

  protected auditoriaServicios: Auditoria_servicio[] = [];
  protected loading = false;
  protected filter = "";

  constructor(
    private auditoriaServicioService: AuditoriaServicioService
  ) { }

  ngOnInit(): void {
    this.getAllServiceAudit();
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


}
