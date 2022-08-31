import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EquipoDropDown } from 'src/app/models/equipo.model';
import { TrabajadoresDropDown } from 'src/app/models/persona.model';
import { CreateServicioDTO, ServicioRelaciones, ServiciosCantidadCompAsigSinAsignar, ServiciosCantidadPorTipoServicio, UpdateServicioDTO } from 'src/app/models/servicio.model';
import { TipoServicio } from 'src/app/models/tipo_servicio.model';
import { EquipoService } from 'src/app/services/equipo.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoServicioService } from 'src/app/services/tipo-servicio.service';
import Swal from 'sweetalert2';

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
  // protected servicios: ServicioRelaciones[] = [];
  protected tiposServicios: TipoServicio[] = [];
  protected idServicio: number | null = null;
  protected equipos: EquipoDropDown[] = [];
  protected viewCompletedService = false;
  protected loadingGraphicAsig = false; // Carga grafico de cantidad de servicios asignados y no asignados
  protected loadingGraphicType = false; // Carga de grafico por tipo de servicios
  protected loadingGraphicCom = false; // Carga grafico de cantidad de servicios pendientes y finalizados
  protected loading = false; // Carga principal
  protected filter = "";

  protected serviceForm!: FormGroup;
  protected newService!: Boolean;
  protected idService!: number;

  constructor(
    private servicioService: ServicioService,
    private tipoServicioService: TipoServicioService,
    private equipoService: EquipoService,
    private personaService: PersonaService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('idNoti');
    this.idServicio = Number(id);
    localStorage.removeItem('idNoti');
    this.getAllData();
    this.initForm();
    if (this.idServicio) {
      this.getOneService(this.idServicio);
    }
  }

  private getAllData() {
    this.getServiceAmount();
    this.getServiceByType();
    this.getAllEquipment();
    this.getAllServiceTypes();
    // this.getAllServicesWithRelations();
    this.getAllWorkers();
    this.getAllServicesWithRelationsNotCompleted();
  }

  // private getAllServicesWithRelations() {
  //   this.loading = true;
  //   this.servicioService.getAllWithRelations()
  //     .subscribe(services => {
  //       this.servicios = services;
  //       this.loading = false;
  //     });
  // }

  protected switchView(){
    if (this.viewCompletedService) {
      this.viewCompletedService = false;
      this.getAllServicesWithRelationsCompleted();
    } else {
      this.viewCompletedService = true;
      this.getAllServicesWithRelationsNotCompleted();
    }
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
        console.log(services)
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
        this.filter = String(service.fechaCreado).replace("T", " ").substring(0,18);
      });
  }

  protected createService(dto: CreateServicioDTO) {
    // Pendiente de asignación de Trabajador
    this.loading = true;
    this.servicioService.create(dto)
      .subscribe(service => {
        if (service) {
          if (this.viewCompletedService) {
            this.serviciosCompletados.push(service)
          } else {
            this.serviciosPendientes.push(service);
          }
          Swal.fire({
            title: 'Creado',
            text: 'Servicio creado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected updateService(idServicio: number, dto: UpdateServicioDTO) {
    this.loading = true;
    this.servicioService.update(idServicio, dto)
      .subscribe(res => {
        if (res) {
          if (this.viewCompletedService) {
            const serviceIndex = this.serviciosCompletados.findIndex(
              (r) => r.idServicio === idServicio);
              this.serviciosCompletados[serviceIndex] = res;
          } else {
            const serviceIndex = this.serviciosPendientes.findIndex(
              (r) => r.idServicio === idServicio);
              this.serviciosPendientes[serviceIndex] = res;
          }
          Swal.fire({
            title: "Actualizado",
            text: "Servicio actualizado",
            icon: 'success'
          });
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
          if (this.viewCompletedService) {
            const serviceIndex = this.serviciosCompletados.findIndex(
              (r) => r.idServicio === idServicio);
              this.serviciosCompletados.splice(serviceIndex, 1);
          } else {
            const serviceIndex = this.serviciosPendientes.findIndex(
              (r) => r.idServicio === idServicio);
              this.serviciosPendientes.splice(serviceIndex, 1);
          }
          Swal.fire({
            title: 'Eliminado',
            text: 'Servicio eliminado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected openModalByService(service?: ServicioRelaciones) {
    this.initForm();
    if (service) {
      this.newService = false;
      this.setPhone(service);
    }
  }

  private initForm() {
    this.newService = true;
    this.serviceForm = this.formBuilder.group({
      // fechaHoraRealizar: [''],
      // fechaCreado: [''],
      // fechaFinalizado: [''],
      // estado: [''],
      // fechaHoraAsignadoTrabajador: [''],
      // idTrabajador: [''],
      prioridad: [''],
      idTipoServicio: ['', [Validators.required]],
      idEquipo: ['', [Validators.required]],
    });
  }

  private setPhone(service: ServicioRelaciones) {
    let idEquipo, idTipoServicio, idTrabajador = null;
    idEquipo = (service.Equipo.idEquipo) ? service.Equipo.idEquipo : 0;
    idTipoServicio = (service.Tipo_Servicio?.idTipoServicio) ? service.Tipo_Servicio.idTipoServicio : 0;
    idTrabajador = (service.Trabajador?.idPersona) ? service.Trabajador.idPersona : 0;
    this.serviceForm.setValue({
      prioridad: service.prioridad,
      idTipoServicio: idTipoServicio,
      idEquipo: idEquipo,
      // fechaHoraAsignadoTrabajador: service.fechaHoraAsignadoTrabajador,
      // estado: service.estado,
      // fechaCreado: service.fechaCreado,
      // fechaFinalizado: service.fechaFinalizado,
    });
    this.serviceForm.addControl('fechaHoraRealizar', this.formBuilder.control(service.fechaHoraRealizar, []))
    this.serviceForm.addControl('idTrabajador', this.formBuilder.control(idTrabajador, []))
    // this.serviceForm.addControl('idServicio', this.formBuilder.control(service.idServicio, []));
    this.idService = service.idServicio;
  }

  protected createServiceForm() {
    if (this.serviceForm.invalid) return Object.values(this.serviceForm.controls).forEach(c => c.markAsTouched());
    if (!this.serviceForm.touched) return;
    const { idService, ...rest } = this.serviceForm.value;
    if (idService) {
      return this.updateService(idService, rest);
    }
    return this.createService(rest);
  }

  protected deleteServiceModal() {
    Swal.fire({
      title: '¡Atención!',
      text: '¿Está seguro de eliminar el servicio?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.deleteService(this.idService);
      }
    });
  }

  private clearInput() {
    this.filter = "";
  }
}
