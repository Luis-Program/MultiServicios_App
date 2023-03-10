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
import { Router } from '@angular/router';

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
  protected servicio: ServicioRelaciones | null = null;
  protected trabajadores: TrabajadoresDropDown[] = [];
  protected fechaFinalizado: string | null = null;
  protected prioridad = ['Alta', 'Media', 'Baja'];
  protected tiposServicios: TipoServicio[] = [];
  protected idServicio: number | null = null;
  protected equipos: EquipoDropDown[] = [];
  protected title = "SERVICIOS PENDIENTES"
  protected viewCompletedService = false;
  protected loading = false; // Carga principal
  protected filter = "";

  protected serviceForm!: FormGroup;
  protected newService!: Boolean;
  protected idService!: number;

  public chartService!: any[];
  public chartServicesUnAssigned !: any[];
  public chartTypeService!: any[];
  public gradient: boolean = true;
  public showLabels: boolean = true;
  public isDoughnut: boolean = false;
  public showLegend: boolean = true;
  public colorScheme: string = 'ocean';

  constructor(
    private servicioService: ServicioService,
    private tipoServicioService: TipoServicioService,
    private equipoService: EquipoService,
    private personaService: PersonaService,
    private formBuilder: FormBuilder,
    private router:Router
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
    this.getAllWorkers();
    this.getAllServicesWithRelationsNotCompleted(true);
  }

  protected get label(){
    return 'teste \n  tesas'
  }

  protected switchView() {
    if (this.viewCompletedService) {
      this.title = "SERVICIOS PENDIENTES";
      this.viewCompletedService = false;
      this.getAllServicesWithRelationsNotCompleted(false);
    } else {
      this.title = "SERVICIOS COMPLETADOS";
      this.viewCompletedService = true;
      this.getAllServicesWithRelationsCompleted();
    }
  }

  protected getAllServicesWithRelationsCompleted() {
    this.servicioService.getAllServicesCompleted()
      .subscribe(services => {
        this.serviciosCompletados = services;
      });
  }

  protected getAllServicesWithRelationsNotCompleted(load: boolean) {
    this.loading = load;
    this.servicioService.getAllServicesNotCompleted()
      .subscribe(services => {
        this.serviciosPendientes = services;
        this.loading = false;
      });
  }

  protected calendar(){
    this.router.navigate(['gerente-general/calendario']);
  }

  private getServiceByType() {
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
      });
  }

  private getServiceAmount() {
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
            name: 'Servicios pendientes',
            value: data.cantidadServicios - data.serviciosCompletados
          }
        ];

        this.chartServicesUnAssigned = [
          {
            name: 'Servicios asignados',
            value: data.serviciosAsignados
          },
          {
            name: 'Servicios sin asignar',
            value: data.cantidadServicios - data.serviciosAsignados
          }
        ];
      });
  }

  protected reloadGraphics(){
    this.getServiceAmount();
    this.getServiceByType();

  }

  protected loadDataCreateDelete() {
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
      });
  }

  protected getOneService(idServicio: number) {
    this.servicioService.getOne(idServicio)
      .subscribe(service => {
        if (service.fechaCreado) {
          this.filter = String(this.parseDate(service.fechaCreado));
        }
      });
  }

  protected createService(dto: CreateServicioDTO) {
    dto.fechaHoraRealizar = null;
    dto.idTrabajador = null;
    dto.observaciones = null;
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
          this.reloadGraphics();
        }
      });
  }

  protected updateService(idServicio: number, dto: UpdateServicioDTO) {
    dto.observaciones = dto.observaciones === "No ingresadas" ? null : dto.observaciones;
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
          this.reloadGraphics();
          this.getAllWorkers();
        }
      });
  }

  protected deleteService(idServicio: number) {
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
          this.reloadGraphics();
        }
      });
  }

  protected openModalByService(service?: ServicioRelaciones, edit?: boolean) {
    this.clearInput();
    if (edit) {
      this.initForm(true);
    } else {
      this.initForm();
    }
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

  private initForm(data?:boolean) {
    this.newService = true;
    this.serviceForm = this.formBuilder.group({
      idServicio: [''],
      prioridad: ['', [Validators.required]],
      fechaHoraRealizar: [''],
      observaciones : [''],
      idTipoServicio: ['', [Validators.required]],
      idTrabajador: [''],
      idEquipo: ['', [Validators.required]],
    });
  }

  protected get prioridadServicio() {
    return this.serviceForm.get('prioridad');
  }

  protected get fechaHoraRealizar() {
    return this.serviceForm.get('fechaHoraRealizar');
  }

  protected get idTipoServicio() {
    return this.serviceForm.get('idTipoServicio');
  }

  protected get idTrabajador() {
    return this.serviceForm.get('idTrabajador');
  }

  protected get idEquipo() {
    return this.serviceForm.get('idEquipo');
  }

  protected parseDate(date :Date){
    return formatDate(date,'medium','es');
  }

  private setService(service: ServicioRelaciones) {
    this.servicio = service;
    this.fechaFinalizado = service.fechaFinalizado ? this.parseDate(service.fechaFinalizado) : null;
    let idEquipo, idTipoServicio, idTrabajador = null;
    idEquipo = (service.Equipo.idEquipo) ? service.Equipo.idEquipo : 0;
    idTipoServicio = (service.Tipo_Servicio?.idTipoServicio) ? service.Tipo_Servicio.idTipoServicio : 0;
    idTrabajador = (service.Trabajador?.idPersona) ? service.Trabajador.idPersona : 0;
    this.serviceForm.setValue({
      idServicio: service.idServicio,
      prioridad: service.prioridad,
      observaciones : service.observaciones ? service.observaciones : 'No ingresadas',
      fechaHoraRealizar: service.fechaHoraRealizar ? formatDate(service.fechaHoraRealizar,'yyyy-MM-ddTHH:mm:ss','es') : 'No ingresado',
      idTipoServicio: (idTipoServicio > 2) ? 1 : idTipoServicio,
      idTrabajador: idTrabajador,
      idEquipo: idEquipo,
    });
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
    }
    this.createService(rest);
  }

  protected deleteServiceModal() {
    let servicio!: ServicioRelaciones;
    if (this.viewCompletedService) {
      const serviceIndex = this.serviciosCompletados.findIndex(
        (r) => r.idServicio === this.idService);
      servicio = this.serviciosCompletados[serviceIndex];
    } else {
      const serviceIndex = this.serviciosPendientes.findIndex(
        (r) => r.idServicio === this.idService);
      servicio = this.serviciosPendientes[serviceIndex] as ServicioRelaciones;
    }
    if (servicio.estado != "En ejecuci??n.") {
      Swal.fire({
        title: '??Atenci??n!',
        text: '??Est?? seguro de eliminar el servicio?',
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
