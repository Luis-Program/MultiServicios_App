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
  protected typeServiceUncompleted = false;
  protected idEquipo: string | null = null;
  protected equipos: EquipoCliente[] = [];
  protected typeServiceCompleted = false;
  protected typeService = 'PENDIENTES';
  protected showEquipments = true;
  protected title = "SERVICIOS";
  protected noServices = false;
  protected loading = false;
  protected filter = "";

  // CHART
  protected chartData  !: any[];
  protected gradient: boolean = true;
  protected showLegend: boolean = true;
  protected showLabels: boolean = true;
  protected isDoughnut: boolean = false;
  protected colorScheme: string = 'ocean'
  protected legendTitle: string = 'Total de Servicios';

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
      // DELETE THIS
      this.getGraphicsAll()
    }
    this.initForm();
  }

  protected changeViewService(back?: boolean) {
    if (back) {
      this.title = "SERVICIOS";
      this.noServices = this.typeServiceCompleted = this.typeServiceUncompleted = false;
      this.showEquipments = true;
      this.typeService = 'PENDIENTES';
      this.equipo = null;
      this.getGraphicsAll();
    } else {
      if (this.typeService === 'FINALIZADOS' && this.typeServiceCompleted && this.equipo) {
        this.getAllServicesWithRelationsCompleted(this.equipo.idEquipo);
        this.typeService = 'PENDIENTES';
      } else if (this.typeService === 'PENDIENTES' && this.typeServiceUncompleted && this.equipo) {
        this.getAllServicesWithRelationsNotCompleted(this.equipo.idEquipo);
        this.typeService = 'FINALIZADOS';
      }
    }
  }

  protected getGraphicsAll() {
    if (this.idPersona) {
      this.servicioService.getAllGraphicsClient(this.idPersona)
        .subscribe(data => {
          // this.graphicAll = data
          this.chartData = [
            {
              name: 'Pendientes',
              value: data.pendientes
            },
            {
              name: 'Finalizados',
              value: data.finalizados
            }
          ];
        });
    }
  }

  protected getGraphicsOne() {
    if (this.equipo) {
      this.servicioService.getOneGraphicsClient(this.equipo.idEquipo)
        .subscribe(data => {
          // this.graphicAll = data
          this.chartData = [
            {
              name: 'Pendientes',
              value: data.pendientes
            },
            {
              name: 'Finalizados',
              value: data.finalizados
            }
          ];
        });
    }
  }


  protected getAllEquipment(idPersona: string) {
    this.loading = true;
    this.equipo = null;
    this.equipoService.getAllByIdPersona(idPersona)
      .subscribe(equipments => {
        this.equipos = equipments;
        if (this.idServicio) {
          this.getOneService(this.idServicio);
        } else {
          this.showEquipments = true;
        }
        this.loading = false;
      });
  }

  protected getAllServicesByEquipment(equipo: EquipoCliente) {
    this.clearInput();
    this.getAllServicesWithRelationsCompleted(equipo.idEquipo);
    this.getAllServicesWithRelationsNotCompleted(equipo.idEquipo);

  }

  private setEquipment(id: number) {
    const equipmentIndex = this.equipos.findIndex(
      (res) => res.idEquipo === id);
    this.equipo = this.equipos[equipmentIndex];
    this.title = 'SERVICIOS ' + this.equipo.nombre.toUpperCase() + ' ' + this.equipo.modelo.toUpperCase();
    this.getGraphicsOne();
  }

  protected getAllServicesWithRelationsCompleted(idEquipo: number) {
    this.servicioService.getAllByIdEquipoCompleted(idEquipo)
      .subscribe(services => {
        this.serviciosCompletados = services;
        if (this.idServicio) {
          this.getAllServicesWithRelationsNotCompleted(idEquipo);
        }
      });
  }

  protected getAllServicesWithRelationsNotCompleted(idEquipo: number, load?: boolean) {
    this.servicioService.getAllByIdEquipoNotCompleted(idEquipo)
      .subscribe(services => {
        this.serviciosPendientes = services;
        if (!load) {
          if (this.serviciosPendientes.length > 0) {
            this.typeServiceUncompleted = true;
            this.showEquipments = false;
          }
          if (this.serviciosCompletados.length > 0) {
            this.typeServiceCompleted = true;
            this.showEquipments = false;
          }
          if (!this.typeServiceCompleted && !this.typeServiceUncompleted) {
            this.noServices = true;
            this.typeServiceUncompleted = true;
            this.typeServiceCompleted = false;
            this.showEquipments = false;
          }
          if (this.typeServiceCompleted && !this.typeServiceUncompleted) {
            this.typeService = 'FINALIZADOS';
          }
        }
        if (this.idServicio) {
          this.findService();
        }
        this.setEquipment(idEquipo);
      });
  }

  protected findService() {
    let found = false;
    if (this.serviciosCompletados.length > 0) {
      const serviceIndex = this.serviciosCompletados.findIndex(
        (res) => res.idServicio === this.idServicio);
      if (serviceIndex != -1) {
        found = true;
        this.typeService = 'FINALIZADOS';
        this.filter = String(this.parseDate(this.serviciosCompletados[serviceIndex].fechaCreado));
      }
    }
    if (this.serviciosPendientes.length > 0 && !found) {
      const serviceIndex = this.serviciosPendientes.findIndex(
        (res) => res.idServicio === this.idServicio);
      if (serviceIndex != -1) {
        found = true;
        this.filter = String(this.parseDate(this.serviciosPendientes[serviceIndex].fechaCreado));
      }
    }
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
        this.getAllServicesWithRelationsCompleted(service.Equipo.idEquipo);

      });
  }

  protected createService(dto: CreateServicioDTO) {
    this.servicioService.createClient(dto)
      .subscribe(service => {
        if (service) {
          this.serviciosPendientes.push(service);
          if (this.noServices) {
            this.noServices = false;
          }
          Swal.fire({
            title: 'Creado',
            text: 'Servicio creado',
            icon: 'success'
          });
          this.clearInput();

        }
        if (this.equipo) {
          this.getGraphicsOne();
        }
      });
  }


  protected deleteService(idServicio: number) {
    this.servicioService.delete(idServicio)
      .subscribe(res => {
        if (res) {
          const serviceIndex = this.servicios.findIndex(
            (res) => res.idServicio === idServicio);
          this.servicios.splice(serviceIndex, 1);
          if (this.equipo) {
            this.getAllServicesWithRelationsCompleted(this.equipo.idEquipo);
            this.getAllServicesWithRelationsNotCompleted(this.equipo.idEquipo);
          }
          Swal.fire({
            title: 'Eliminado',
            text: 'Servicio eliminado',
            icon: 'success'
          });
          this.clearInput();
          if (this.equipo) {
            this.getGraphicsOne();
          }
        }
      });
  }

  private clearInput() {
    this.filter = "";
  }

  protected openModalByService(service?: ServicioCliente) {
    this.initForm();
    this.clearInput();
    if (service) {
      this.newService = false;
      return this.setService(service);
    }
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

  protected parseDate(date: Date | null) {
    if (date) {
      return formatDate(date, 'medium', 'es');
    }
    return 'No ingresado';
  }

  protected state(bol: boolean) {
    return bol ? 'Activo' : 'Inactivo';
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
