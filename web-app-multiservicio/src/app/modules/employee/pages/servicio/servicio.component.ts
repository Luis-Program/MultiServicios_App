import { Component, OnInit } from '@angular/core';
import { ServiciosFinalizadosPendientesTrabajador, ServicioTrabajador, UpdateServicioDTO } from 'src/app/models/servicio.model';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

  protected cantidadServicios: ServiciosFinalizadosPendientesTrabajador | null = null;
  protected serviciosPendientes: ServicioTrabajador[] = [];
  protected serviciosCompletados: ServicioTrabajador[] = [];
  protected servicios: ServicioTrabajador[] = [];
  protected idServicio: number | null = null;
  protected idPersona: string | null = null;
  protected loading = false;
  protected filter = "";

  constructor(
    private servicioService: ServicioService
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('idNoti');
    this.idServicio = Number(id);
    localStorage.removeItem('idNoti');
    this.idPersona = localStorage.getItem('idPersona');
    if (this.idPersona) {
      this.getAllServicesWithRelations(this.idPersona);
      this.getAmountServices(this.idPersona);
      if (this.idServicio) {
        this.getOneService(this.idServicio);
      }
    }
  }

  private getAllServicesWithRelations(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllByIdEmployee(idPersona)
      .subscribe(services => {
        console.log(services);
        
        this.servicios = services;
        this.loading = false;
      });
  }

  protected getAllServicesWithRelationsCompleted(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllServicesCompletedByIdWorker(idPersona)
      .subscribe(services => {
        this.serviciosCompletados = services;
      });
  }

  protected getAllServicesWithRelationsNotCompleted(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllServicesNotCompletedByIdWorker(idPersona)
      .subscribe(services => {
        this.serviciosCompletados = services;
      });
  }

  private getAmountServices(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAmountServicesWorker(idPersona)
      .subscribe(services => {
        this.cantidadServicios = services;
        this.loading = false;
      });
  }

  protected getOneService(idServicio: number) {
    this.servicioService.getOne(idServicio)
      .subscribe(service => {
        this.filter = String(service.fechaCreado).replace("T", " ").substring(0,18);
      });
  }

  protected updateService(idServicio: number, dto: UpdateServicioDTO) {
    this.loading = true;
    this.servicioService.updateWorker(idServicio, dto)
      .subscribe(res => {
        if (res) {
          const serviceIndex = this.servicios.findIndex(
            (res) => res.idServicio === idServicio);
          const serviceIndexNotCompleted = this.servicios.findIndex(
            (res) => res.idServicio === idServicio);
          this.servicios[serviceIndex] = res;
          this.serviciosPendientes[serviceIndexNotCompleted] = res;
          this.clearInput();
        }
        this.loading = false;
      });
  }

  private clearInput() {
    this.filter = "";
  }

}
