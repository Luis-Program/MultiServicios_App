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
  protected servicio: ServicioTrabajador | null = null;
  protected servicios: ServicioTrabajador[] = [];
  protected serviciosPendientes: ServicioTrabajador[] = [];
  protected serviciosCompletados: ServicioTrabajador[] = [];
  protected idServicio: string | null = null;
  protected idPersona: string | null = null;
  protected loading = false;

  constructor(
    private servicioService: ServicioService
  ) { }

  ngOnInit(): void {
    this.idServicio = localStorage.getItem('idNoti');
    localStorage.removeItem('idNoti');
    this.idPersona = localStorage.getItem('idPersona');
    if (this.idPersona) {
      if (this.idServicio) {
        // Show service

        this.getOneService(Number(this.idServicio));
        this.getAmountServices(this.idPersona);
      } else {
        this.getAllServicesWithRelations(this.idPersona);
        this.getAmountServices(this.idPersona);
      }
    }
  }

  private getAllServicesWithRelations(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllByIdEmployee(idPersona)
      .subscribe(services => {
        this.servicios = services;
        this.loading = false;
      });
  }

  protected getAllServicesWithRelationsCompleted(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllServicesCompletedByIdWorker(idPersona)
      .subscribe(services => {
        // console.log(services)
        this.serviciosCompletados = services;
      });
  }

  protected getAllServicesWithRelationsNotCompleted(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllServicesNotCompletedByIdWorker(idPersona)
      .subscribe(services => {
        // console.log(services)
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
    this.servicio = this.servicios.find(service => service.idServicio = idServicio) as ServicioTrabajador;
    if (this.servicio) {
      // show content
    }
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
          // Success
        }
        this.loading = false;
      });
  }

}
