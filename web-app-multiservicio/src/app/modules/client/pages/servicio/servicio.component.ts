import { Component, OnInit } from '@angular/core';
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
  protected servicios: ServicioRelaciones[] = [];
  protected tiposServicios: TipoServicio[] = [];
  protected equipo: EquipoCliente | null = null;
  protected idServicio: number | null = null;
  protected showServicesByEquipment = false;
  protected idPersona: string | null = null;
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
  ) { }

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    const id = localStorage.getItem('idNoti');
    this.idServicio = Number(id);
    localStorage.removeItem('idNoti');
    if (this.idPersona) {
      this.getAllEquipment(this.idPersona);
      if (this.idServicio) {
        this.getOneService(this.idServicio);
      }
    }
  }

  protected getAllEquipment(idPersona: string) {
    this.loading = true;
    this.equipo = null;
    this.equipoService.getAllByIdPersona(idPersona)
      .subscribe(equipments => {
        this.equipos = equipments;
        this.oneService, this.showServicesByEquipment, this.loading = false;
        this.showEquipments = true;
      });
  }

  protected getAllServicesWithRelations(idEquipo: string | number) {
    this.loading = true;
    this.equipo = this.equipos.find(equipo => equipo.idEquipo = Number(idEquipo)) as EquipoCliente;
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
    this.servicioService.getOne(idServicio)
      .subscribe(service => {
        this.getAllServicesWithRelations(service.Equipo.idEquipo);
        this.filter = String(service.fechaCreado).replace("T", " ").substring(0,18);
      });
  }

  protected createService(dto: CreateServicioDTO) {
    // Pendiente de asignación de Trabajador
    this.loading = true;
    this.servicioService.create(dto)
      .subscribe(service => {
        if (service) {
          this.servicios.push(service);
          this.serviciosPendientes.push(service);
          this.clearInput();
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
          this.clearInput();
        }
        this.loading = false;
      });
  }

  private clearInput(){
    this.filter = "";
  }

}
