import { Component, OnInit } from '@angular/core';
import { EquipoDropDown } from 'src/app/models/equipo.model';
import { TrabajadoresDropDown } from 'src/app/models/persona.model';
import { CreateServicioDTO, ServicioRelaciones, ServiciosCantidadCompAsigSinAsignar, ServiciosCantidadPorTipoServicio, UpdateServicioDTO } from 'src/app/models/servicio.model';
import { TipoServicio } from 'src/app/models/tipo_servicio.model';
import { EquipoService } from 'src/app/services/equipo.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoServicioService } from 'src/app/services/tipo-servicio.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

  protected servicioCantidades: ServiciosCantidadCompAsigSinAsignar | null = null;
  protected servicioPorTipo: ServiciosCantidadPorTipoServicio | null = null;
  protected serviciosCompletados: ServicioRelaciones[] = [];
  protected serviciosPendientes: ServicioRelaciones[] = [];
  protected trabajadores: TrabajadoresDropDown[] = [];
  protected servicios: ServicioRelaciones[] = [];
  protected tiposServicios: TipoServicio[] = [];
  protected idServicio: number | null = null;
  protected equipos: EquipoDropDown[] = [];
  protected loadingGraphicAsig = false; // Carga grafico de cantidad de servicios asignados y no asignados
  protected loadingGraphicType = false; // Carga de grafico por tipo de servicios
  protected loadingGraphicCom = false; // Carga grafico de cantidad de servicios pendientes y finalizados
  protected loading = false; // Carga principal
  protected filter = "";

  constructor(
    private servicioService: ServicioService,
    private tipoServicioService: TipoServicioService,
    private equipoService: EquipoService,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('idNoti');
    this.idServicio = Number(id);
    localStorage.removeItem('idNoti');
    this.getAllData();
    if (this.idServicio) {
      this.getOneService(this.idServicio);
    }
  }

  private getAllData() {
    this.getServiceAmount();
    this.getServiceByType();
    this.getAllServicesWithRelations();
    this.getAllServicesWithRelationsNotCompleted();
    this.getAllServicesWithRelationsCompleted();
  }

  private getAllServicesWithRelations() {
    this.loading = true;
    this.servicioService.getAllWithRelations()
      .subscribe(services => {
        this.servicios = services;
        this.loading = false;
      });
  }

  protected getAllServicesWithRelationsCompleted() {
    this.loading = true;
    this.servicioService.getAllServicesCompleted()
      .subscribe(services => {
        this.serviciosCompletados = services;
      });
  }

  protected getAllServicesWithRelationsNotCompleted() {
    this.loading = true;
    this.servicioService.getAllServicesNotCompleted()
      .subscribe(services => {
        this.serviciosCompletados = services;
      });
  }

  private getServiceByType() {
    this.loadingGraphicType = true;
    this.servicioService.getServiceAmountTypeService()
      .subscribe(data => {
        this.servicioPorTipo = data;
        this.loadingGraphicType = false;
      });
  }

  private getServiceAmount() {
    this.loadingGraphicAsig = this.loadingGraphicCom = true;
    this.servicioService.getAmountServicesCompletedAsigned()
      .subscribe(data => {
        this.servicioCantidades = {
          serviciosCompletados: data.serviciosCompletados,
          cantidadServicios: data.cantidadServicios,
          serviciosAsignados: data.serviciosAsignados,
          serviciosPendientes: data.cantidadServicios - data.serviciosCompletados,
          serviciosSinAsignar: data.cantidadServicios - data.serviciosAsignados
        }
        this.loadingGraphicAsig = this.loadingGraphicCom = false;
      });
  }

  protected loadDataCreateDelete() {
    this.loading = true;
    this.getAllServiceTypes();
    this.getAllEquipment();
    this.getAllWorkers();
  }

  private getAllServiceTypes() {
    this.tipoServicioService.getAll()
      .subscribe(typeServices => {
        this.tiposServicios = typeServices;
      });
  }

  private getAllEquipment() {
    this.equipoService.getAllDropDown()
      .subscribe(equipments => {
        this.equipos = equipments;
      });
  }

  protected getAllWorkers() {
    this.personaService.getAllWorkersWithServicesDropDown()
      .subscribe(workers => {
        this.trabajadores = workers;
        this.loading = true;
      });
  }

  protected getOneService(idServicio: number) {
    this.servicioService.getOne(idServicio)
      .subscribe(service => {
        this.filter = String(service.fechaCreado).replace("T", " ");
      });
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
          // this.getAllServicesWithRelations();
          // this.getAllServicesWithRelationsNotCompleted();
        }
        this.loading = false;
      });
  }

  protected updateService(idServicio: number, dto: UpdateServicioDTO) {
    this.loading = true;
    this.servicioService.update(idServicio, dto)
      .subscribe(res => {
        if (res) {
          this.getAllServicesWithRelations();
          this.getAllServicesWithRelationsNotCompleted();
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
