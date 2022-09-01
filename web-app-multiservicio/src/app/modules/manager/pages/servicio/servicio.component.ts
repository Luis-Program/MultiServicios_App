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
import { formatDate } from '@angular/common';

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
  protected prioridad = ['Alta', 'Media', 'Baja'];
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

  public chartService!: any[];
  public chartTypeService!: any[];
  public gradient: boolean = true;
  public showLabels: boolean = true;
  public isDoughnut: boolean = false;
  public showLegend: boolean = true;
  public colorScheme: string = 'nightLights';
  public legendTitle: string = 'Servicios';
  public legendType: string = 'Tipos de servicios'

  constructor(
    private servicioService: ServicioService,
    private tipoServicioService: TipoServicioService,
    private equipoService: EquipoService,
    private personaService: PersonaService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('idNoti');
    this.idServicio = Number(id);
    const completed = localStorage.getItem('tipo');
    localStorage.removeItem('idNoti');
    localStorage.removeItem('tipo');
    this.getAllData();
    this.initForm();
    if (this.idServicio) {
      if (completed) {
        this.switchView();
      }
      this.getOneService(this.idServicio);
    }
  }

  private getAllData() {
    this.getServiceAmount();
    this.getServiceByType();
    this.getAllEquipment();
    this.getAllServiceTypes();
    // this.getAllServicesWithRelationsCompleted();
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

  protected switchView() {
    if (this.viewCompletedService) {
      this.viewCompletedService = false;
      this.getAllServicesWithRelationsNotCompleted();
    } else {
      this.viewCompletedService = true;
      this.getAllServicesWithRelationsCompleted();
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
        this.serviciosPendientes = services;
      });
  }

  private getServiceByType() {
    this.loadingGraphicType = true;
    this.servicioService.getServiceAmountTypeService()
      .subscribe((data: ServiciosCantidadPorTipoServicio) => {
        this.servicioPorTipo = data;

        this.chartTypeService = [
          {
            name  : 'Preventivo',
            value : data.preventivo
          },
          {
            name  : 'Correctivo',
            value : data.correctivo
          }
        ]
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

        this.chartService = [
          {
            name: 'Servicios completados',
            value: data.serviciosCompletados
          },
          {
            name: 'Cantidad de servicios',
            value: data.cantidadServicios
          },
          {
            name: 'Servicios asignados',
            value: data.serviciosAsignados
          },
          {
            name: 'Servicios pendientes',
            value: data.cantidadServicios - data.serviciosCompletados
          },
          {
            name: 'Servicios sin asignar',
            value: data.cantidadServicios - data.serviciosAsignados
          }
        ]
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
        this.filter = String(service.fechaCreado).replace("T", " ").substring(0, 18);
      });
  }

  protected createService(dto: CreateServicioDTO) {
    dto.fechaHoraRealizar = null;
    // Pendiente de asignación de Trabajador
    console.log("Crear: "+dto)
    this.loading = true;
    this.servicioService.create(dto)
      .subscribe(service => {
        if (service) {
          console.log(service)
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
        return this.setService(service);
      }
  }

  protected throwAlert(){
    Swal.fire({
      title: "Denegado",
      text: "No puede modificar el servicio",
      icon: 'warning'
    });
  }

  private initForm() {
    this.newService = true;
    this.serviceForm = this.formBuilder.group({
      idServicio: [''],
      prioridad: [''],
      fechaHoraRealizar: [''],
      idTipoServicio: ['', [Validators.required]],
      idEquipo: ['', [Validators.required]],
    });
  }

  protected parseDate(date :Date){
    return formatDate(date,'yyyy-MM-dd hh-mm-ss aaa','en')
  }

  private setService(service: ServicioRelaciones) {
    let idEquipo, idTipoServicio, idTrabajador = null;
    idEquipo = (service.Equipo.idEquipo) ? service.Equipo.idEquipo : 0;
    idTipoServicio = (service.Tipo_Servicio?.idTipoServicio) ? service.Tipo_Servicio.idTipoServicio : 0;
    idTrabajador = (service.Trabajador?.idPersona) ? service.Trabajador.idPersona : 0;

    this.serviceForm.setValue({
      idServicio: service.idServicio,
      prioridad: service.prioridad,
      fechaHoraRealizar: service.fechaHoraRealizar ? formatDate(service.fechaHoraRealizar,'dd/MM/yyy HH:mm aa','en') : 'No ingresado',
      idTipoServicio: (idTipoServicio > 2) ? 1 : idTipoServicio,
      idEquipo: idEquipo,
    });

    this.serviceForm.addControl('fechaHoraRealizar', this.formBuilder.control(formatDate(service.fechaHoraRealizar!, 'yyyy-MM-ddTHH:mm:ss', 'en'), []))
    this.serviceForm.addControl('idTrabajador', this.formBuilder.control(idTrabajador, []))

    this.serviceForm.updateValueAndValidity();
    this.idService = service.idServicio;
  }

  protected createServiceForm() {
    if (this.serviceForm.invalid) return Object.values(this.serviceForm.controls).forEach(c => c.markAsTouched());
    if (!this.serviceForm.touched) return;
    const { idServicio, ...rest } = this.serviceForm.value;
    if (idServicio) {
      if (!this.viewCompletedService) {
        return this.updateService(idServicio, rest);
      } else {
        this.throwAlert();
      }
    }else{
      return this.createService(rest);
    }
  }

  protected deleteServiceModal() {
    let servicio!: ServicioRelaciones;
    console.log(this.viewCompletedService)
    if (this.viewCompletedService) {
      const serviceIndex = this.serviciosCompletados.findIndex(
        (r) => r.idServicio === this.idService);
      servicio = this.serviciosCompletados[serviceIndex];
    } else {
      const serviceIndex = this.serviciosPendientes.findIndex(
        (r) => r.idServicio === this.idService);
      servicio = this.serviciosPendientes[serviceIndex] as ServicioRelaciones;
    }
    if (servicio.estado != "En ejecución.") {
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
    } else {
      Swal.fire({
        title: "Denegado",
        text: "No puede eliminar el servicio",
        icon: 'warning'
      });
    }
  }

  private clearInput() {
    this.filter = "";
  }
}
