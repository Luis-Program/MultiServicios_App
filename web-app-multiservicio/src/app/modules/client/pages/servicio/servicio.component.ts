import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EquipoCliente } from 'src/app/models/equipo.model';
import { CreateServicioDTO, ServicioRelaciones } from 'src/app/models/servicio.model';
import { TipoServicio } from 'src/app/models/tipo_servicio.model';
import { EquipoService } from 'src/app/services/equipo.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoServicioService } from 'src/app/services/tipo-servicio.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

  protected serviciosPendientes: ServicioRelaciones[] = [];
  protected serviciosCompletados: ServicioRelaciones[] = [];
  protected servicio: ServicioRelaciones | null = null;
  protected servicios: ServicioRelaciones[] = [];
  protected tiposServicios: TipoServicio[] = [];
  protected idServicio: string | null = null;
  protected idPersona: string | null = null;
  protected showServicesByEquipment = false;
  protected idEquipo: string | null = null;
  protected equipos: EquipoCliente[] = [];
  protected showEquipments = false;
  protected oneService = false;
  protected loading = false;
  protected filter = "";

  constructor(
    private servicioService: ServicioService,
    private tipoServicioService: TipoServicioService,
    private equipoService: EquipoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idEquipo = localStorage.getItem('idEquipo');
    localStorage.removeItem('idEquipo');
    this.idPersona = localStorage.getItem('idPersona');
    this.idServicio = localStorage.getItem('idNoti');
    localStorage.removeItem('idNoti');
    if (this.idPersona) {
      if (this.idEquipo) {
        this.getAllServicesWithRelations(this.idEquipo);
        this.getAllServicesWithRelationsCompleted(this.idEquipo);
        this.getAllServicesWithRelationsNotCompleted(this.idEquipo);
      } else if (this.idServicio) {
        // Show service
        this.getOneService(Number(this.idServicio));
      } else {
        this.getAllEquipment(this.idPersona);
      }
    }
  }

  protected getAllEquipment(idPersona: string) {
    this.loading = true;
    this.equipoService.getAllByIdPersona(idPersona)
      .subscribe(equipments => {
        this.equipos = equipments;
        this.oneService, this.showServicesByEquipment, this.loading = false;
        this.showEquipments = true;
      });
  }

  protected getAllServicesWithRelations(idEquipo: string | number) {
    this.loading = true;
    this.servicioService.getAllByIdEquipo(idEquipo)
      .subscribe(services => {
        this.servicios = services;
        this.showServicesByEquipment = true;
        this.oneService = this.showEquipments = this.loading = false;
      });
  }

  protected getAllServicesWithRelationsCompleted(idEquipo: string | number) {
    this.loading = true;
    this.servicioService.getAllByIdEquipoCompleted(idEquipo)
      .subscribe(services => {
        this.serviciosCompletados = services;
        this.showServicesByEquipment = true;
        this.oneService = this.showEquipments = this.loading = false;
      });
  }

  protected getAllServicesWithRelationsNotCompleted(idEquipo: string | number) {
    this.loading = true;
    this.servicioService.getAllByIdEquipoNotCompleted(idEquipo)
      .subscribe(services => {
        this.serviciosCompletados = services;
        this.showServicesByEquipment = true;
        this.oneService = this.showEquipments = this.loading = false;
      });
  }

  protected getAllServiceTypes() {
    this.tipoServicioService.getAll()
      .subscribe(typeServices => {
        this.tiposServicios = typeServices;
      });
  }

  protected getOneService(idServicio: number) {
    this.servicio = this.servicios.find(service => service.idServicio = idServicio) as ServicioRelaciones;
    if (this.servicio) {
      this.oneService = true;
      this.showEquipments, this.showServicesByEquipment = false;
      // show content
    }
  }

  protected createService(dto: CreateServicioDTO) {
    // Pendiente de asignación de Trabajador
    this.loading = true;
    this.servicioService.create(dto)
      .subscribe(service => {
        if (service) {
          // Success
          this.servicios.push(service);
          this.serviciosPendientes.push(service);
        }
        this.loading = false;
      });
  }


  protected deleteService(idServicio: number) {
    this.loading = true;
    this.servicioService.delete(idServicio)
      .subscribe(res => {
        if (res) {
          const serviceIndex = this.servicios.findIndex(
            (res) => res.idServicio === idServicio);
          this.servicios.splice(serviceIndex, 1);
          // Success
        }
        this.loading = false;
      });
  }

  protected goToEquipment(idEquipo: string) {
    if (idEquipo) {
      this.router.navigate(['cliente/equipo']);
    }
  }

}
