import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EquipoCliente } from 'src/app/models/equipo.model';
import { CreateServicioDTO, ServicioCliente, ServicioRelaciones } from 'src/app/models/servicio.model';
import { TipoServicio } from 'src/app/models/tipo_servicio.model';
import { EquipoService } from 'src/app/services/equipo.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TipoServicioService } from 'src/app/services/tipo-servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

  protected serviciosCompletados: ServicioCliente[] = [];
  protected serviciosPendientes: ServicioCliente[] = [];
  protected servicio: ServicioCliente | null = null;
  protected prioridad = ['Alta', 'Media', 'Baja'];
  protected servicios: ServicioRelaciones[] = [];
  protected equipo: EquipoCliente | null = null;
  protected tiposServicios: TipoServicio[] = [];
  protected idServicio: number | null = null;
  protected idPersona: string | null = null;
  protected idEquipo: string | null = null;
  protected equipos: EquipoCliente[] = [];
  protected typeServiceCompleted = false;
  protected typeServiceUncompleted = false;
  protected showEquipments = true;
  protected typeService = 'PENDIENTES';
  protected oneService = false;
  protected title = "EQUIPOS";
  protected loading = false;
  protected filter = "";

  protected serviceForm!: FormGroup;
  protected newService!: Boolean;
  protected idService!: number;

  constructor(
    private servicioService: ServicioService,
    private tipoServicioService: TipoServicioService,
    private equipoService: EquipoService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    const id = localStorage.getItem('idNoti');
    this.idServicio = Number(id);
    localStorage.removeItem('idNoti');
    this.getAllServiceTypes();
    if (this.idPersona) {
      this.getAllEquipment(this.idPersona);
      if (this.idServicio) {
        // this.getOneService(this.idServicio);
      }
    }
    this.initForm();
  }

  protected changeViewService(back?: boolean) {
    if (back) {
      this.title = "EQUIPOS";
      this.typeServiceCompleted = this.typeServiceUncompleted = false;
      this.showEquipments = true;
      this.typeService = 'PENDIENTES';
    } else {
      if (this.typeService === 'FINALIZADOS' && this.typeServiceCompleted && this.equipo) {
        this.getAllServicesWithRelationsCompleted(this.equipo.idEquipo);
        this.typeService = 'PENDIENTES';
      } else if (this.typeService === 'PENDIENTES' && this.typeServiceUncompleted && this.equipo) {
        this.getAllServicesWithRelationsNotCompleted(this.equipo.idEquipo, true);
        this.typeService = 'FINALIZADOS';
      }
    }
  }

  protected getAllEquipment(idPersona: string) {
    this.loading = true;
    this.equipo = null;
    this.equipoService.getAllByIdPersona(idPersona)
      .subscribe(equipments => {
        this.equipos = equipments;
        this.oneService, this.loading = false;
        this.showEquipments = true;
      });
  }

  // Aqui cambia a servicios
  // protected getAllServicesWithRelations(equipo: EquipoCliente) {
  //   this.loading = true;
  //   this.equipo = this.equipos.find(equipo => equipo.idEquipo = Number(equipo.idEquipo)) as EquipoCliente;
  //   this.servicioService.getAllByIdEquipo(equipo.idEquipo)
  //     .subscribe(services => {
  //       console.log(services.length)
  //       this.servicios = services;
  //       if (services.length > 0) {
  //         this.showEquipments = false;
  //       }else {
  //         this.throwAlert();
  //       }
  //     });
  // }

  protected getAllServicesByEquipment(equipo: EquipoCliente) {
    this.getAllServicesWithRelationsCompleted(equipo.idEquipo);
  }

  private setEquipment(id: number) {
    const equipmentIndex = this.equipos.findIndex(
      (res) => res.idEquipo === id);
    this.equipo = this.equipos[equipmentIndex];
    this.title = 'SERVICIOS ' + this.equipo.nombre.toUpperCase() + ' ' + this.equipo.modelo.toUpperCase();
  }

  protected getAllServicesWithRelationsCompleted(idEquipo: number) {
    this.loading = true;
    this.servicioService.getAllByIdEquipoCompleted(idEquipo)
      .subscribe(services => {
        this.serviciosCompletados = services;
        this.getAllServicesWithRelationsNotCompleted(idEquipo);
      });
  }

  protected getAllServicesWithRelationsNotCompleted(idEquipo: number, load?: boolean) {
    this.servicioService.getAllByIdEquipoNotCompleted(idEquipo)
      .subscribe(services => {
        this.serviciosPendientes = services;
        if (!load) {
          if (this.serviciosPendientes.length > 0) {
            this.showEquipments = false;
            this.typeServiceUncompleted = true;
          }
          if (this.serviciosCompletados.length > 0) {
            this.showEquipments = false;
            this.typeServiceCompleted = true;
          }
          if (!this.typeServiceCompleted && !this.typeServiceUncompleted) {
            this.throwAlert();
            this.showEquipments = true;
            this.typeServiceCompleted = this.typeServiceUncompleted = false;
          }
          if (this.typeServiceCompleted || this.typeServiceUncompleted) {
            this.setEquipment(idEquipo);
          }
        } else {
          this.setEquipment(idEquipo);
        }
        this.loading = false;
      });
  }

  protected getAllServiceTypes() {
    this.tipoServicioService.getAll()
      .subscribe(typeServices => {
        this.tiposServicios = typeServices;
      });
  }

  // protected getOneService(idServicio: number) {
  //   this.servicioService.getOne(idServicio)
  //     .subscribe(service => {
  //       this.getAllServicesWithRelations(service.Equipo.idEquipo);
  //       this.filter = String(service.fechaCreado).replace("T", " ").substring(0,18);
  //     });
  // }

  protected createService(dto: CreateServicioDTO) {
    // Pendiente de asignación de Trabajador
    this.loading = true;
    this.servicioService.createClient(dto)
      .subscribe(service => {
        if (service) {
          this.serviciosPendientes.push(service);
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


  protected deleteService(idServicio: number) {
    this.loading = true;
    this.servicioService.delete(idServicio)
      .subscribe(res => {
        if (res) {
          const serviceIndex = this.servicios.findIndex(
            (res) => res.idServicio === idServicio);
          this.servicios.splice(serviceIndex, 1);
          if (this.equipo) {
            this.getAllServicesWithRelationsCompleted(this.equipo.idEquipo);
            this.getAllServicesWithRelationsCompleted(this.equipo.idEquipo);
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

  private clearInput() {
    this.filter = "";
  }

  protected openModalByService(service?: ServicioCliente) {
    this.initForm();
    if (service) {
      this.newService = false;
      return this.setService(service);
    }
  }

  protected throwAlert() {
    Swal.fire({
      title: 'No existen servicios para el equipo',
      text: '¿Sea crear un servicio?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.openModalByService();
      }
    });
  }

  private initForm() {
    this.newService = true;
    this.serviceForm = this.formBuilder.group({
      idServicio: [''],
      prioridad: ['', [Validators.required]],
      fechaHoraRealizar: [null],
      fechaFinalizado: [null],
      idTipoServicio: ['', [Validators.required]],
      idTrabajador: [null],
      idEquipo: [this.equipo?.idEquipo, [Validators.required]],
    });
  }

  protected get prioridadServicio() {
    return this.serviceForm.get('prioridad');
  }

  protected get idTipoServicio() {
    return this.serviceForm.get('idTipoServicio');
  }

  protected get idEquipoF() {
    return this.serviceForm.get('idEquipo');
  }

  protected parseDate(date: Date, modal?: boolean) {
    if (modal) {
      return formatDate(date, 'medium', 'en')
    } else {
      return formatDate(date, 'yyyy-MM-dd hh-mm-ss aaa', 'en');
    }
  }

  private setService(service: ServicioCliente) {
    this.servicio = service;
    let idEquipo, idTipoServicio, idTrabajador = null;
    idEquipo = (this.equipo) ? this.equipo.idEquipo : 0;
    idTipoServicio = (service.Tipo_Servicio?.idTipoServicio) ? service.Tipo_Servicio.idTipoServicio : 0;
    idTrabajador = (service.Trabajador?.idPersona) ? service.Trabajador.idPersona : 0;

    this.serviceForm.setValue({
      idServicio: service.idServicio,
      prioridad: service.prioridad,
      fechaHoraRealizar: service.fechaHoraRealizar ? formatDate(service.fechaHoraRealizar, 'dd/MM/yyy HH:mm aa', 'en') : 'No ingresado',
      idTipoServicio: (idTipoServicio > 2) ? 1 : idTipoServicio,
      fechaFinalizado: service.fechaFinalizado,
      idTrabajador: idTrabajador,
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
    if (!idServicio) {
      return this.createService(rest);
    }
  }

  protected deleteServiceModal() {
    if (this.servicio && (this.servicio.fechaFinalizado || !this.servicio.idTrabajador)) {
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
  }

  protected get buttonClose() {
    return (!this.newService && this.servicio && this.servicio.fechaFinalizado === null);
  }

  protected get buttonDelete() {
    return (!this.newService && this.servicio && (this.servicio.fechaFinalizado != null || !this.servicio.idTrabajador))
  }

}
