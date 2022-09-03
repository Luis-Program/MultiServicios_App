import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DireccionRelacionesAnidadas } from 'src/app/models/direccion.model';
import { PersonaRelacionesLogin } from 'src/app/models/persona.model';
import { ServiciosFinalizadosPendientesTrabajador, ServicioTrabajador, UpdateServicioDTO } from 'src/app/models/servicio.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ServicioService } from 'src/app/services/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

  protected cantidadServicios: ServiciosFinalizadosPendientesTrabajador | null = null;
  protected direccion: DireccionRelacionesAnidadas | null = null;
  protected direcciones: DireccionRelacionesAnidadas[] = [];
  protected serviciosCompletados: ServicioTrabajador[] = [];
  protected serviciosPendientes: ServicioTrabajador[] = [];
  protected persona: PersonaRelacionesLogin | null = null;
  protected servicio: ServicioTrabajador | null = null;
  protected personas: PersonaRelacionesLogin[] = [];
  protected servicios: ServicioTrabajador[] = [];
  protected idServicio: number | null = null;
  protected idPersona: string | null = null;
  protected viewCompletedService = false;
  protected title: string = "SERVICIOS PENDIENTES";
  protected loading = false;
  protected filter = "";

  protected serviceForm!: FormGroup;
  protected newService!: Boolean;
  protected idService!: number;

  // CHART  
  public chartData  !: any[];
  public gradient   : boolean = true;
  public showLegend : boolean = true;
  public showLabels : boolean = true;
  public isDoughnut : boolean = false;
  public colorScheme: string  = 'nightLights'
  public legendTitle: string  = 'Servicios';

  constructor(
    private direccionService: DireccionService,
    private servicioService: ServicioService,
    private personaService: PersonaService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('idNoti');
    this.idServicio = Number(id);
    localStorage.removeItem('idNoti');
    this.idPersona = localStorage.getItem('idPersona');
    this.initForm();
    if (this.idPersona) {
      this.getAllServicesWithRelationsNotCompleted(this.idPersona);
      this.getAmountServices(this.idPersona);
      if (this.idServicio) {
        this.getOneService(this.idServicio);
      }
    }
  }

  // private getAllServicesWithRelations(idPersona: string | number) {
  //   this.loading = true;
  //   this.servicioService.getAllByIdEmployee(idPersona)
  //     .subscribe(services => {
  //       this.servicios = services;
  //       this.loading = false;
  //     });
  // }

  protected switchView() {
    if (this.idPersona) {
      if (this.viewCompletedService) {
        this.viewCompletedService = false;
        this.getAllServicesWithRelationsNotCompleted(this.idPersona);
        this.title = "SERVICIOS FINALIZADOS";
      } else {
        this.viewCompletedService = true;
        this.getAllServicesWithRelationsCompleted(this.idPersona);
        this.title = "SERVICIOS PENDIENTES";

      }
    }
  }

  private getAllDirections() {
    this.direccionService.getAllWithRelations()
      .subscribe(data => this.direcciones = data);
  }

  private getAllServicesWithRelationsCompleted(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllServicesCompletedByIdWorker(idPersona)
      .subscribe(services => {
        this.serviciosCompletados = services;
        this.loading = false;
      });
  }

  private getAllServicesWithRelationsNotCompleted(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAllServicesNotCompletedByIdWorker(idPersona)
      .subscribe(services => {
        this.getAllDirections();
        this.getAllPersonsWithTypes();
        this.serviciosPendientes = services;
        this.loading = false;
      });
  }

  private getAmountServices(idPersona: string | number) {
    this.loading = true;
    this.servicioService.getAmountServicesWorker(idPersona)
      .subscribe(services => {
        this.cantidadServicios = services;

        this.chartData = [
          {
            name  : 'Pendientes',
            value : services.pendientes
          },
          {
            name  : 'Finalizados',
            value : services.finalizados
          }
        ]
        
        this.loading = false;
      });
  }

  private getAllPersonsWithTypes() {
    this.personaService.getAllPersonTypesForWorker()
      .subscribe(data => this.personas = data);
  }

  protected getOneService(idServicio: number) {
    this.servicioService.getOne(idServicio)
      .subscribe(service => {
        this.filter = String(service.fechaCreado).replace("T", " ").substring(0, 18);
      });
  }

  protected updateService(idServicio: number, dto: UpdateServicioDTO) {
    this.loading = true;
    this.servicioService.updateWorker(idServicio, dto)
      .subscribe(res => {
        if (res) {
          this.serviciosCompletados.push(res);
          const serviceIndex = this.serviciosPendientes.findIndex(
            (r) => r.idServicio === idServicio);
          this.serviciosPendientes.splice(serviceIndex, 1);
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

  private clearInput() {
    this.filter = "";
  }

  protected openModalByService(service?: ServicioTrabajador) {
    this.initForm();
    if (service) {
      this.newService = false;
      this.servicio = service;
      const addressIndex = this.direcciones.findIndex(
        (res) => res.idDireccion === service.idDireccion);
      this.direccion = this.direcciones[addressIndex];
      const personIndex = this.personas.findIndex(
        (res) => res.idPersona === service.idPersona);
      this.persona = this.personas[personIndex];
      return this.setService(service);
    }
  }

  protected throwAlert() {
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
      fechaFinalizado: ['', Validators.required]
    });
  }

  protected parseDate(date: Date | null, bol?: boolean) {
    if (date) {
      return (bol) ? formatDate(date, 'medium', 'en') : formatDate(date, 'yyyy-MM-dd hh-mm-ss aaa', 'en');
    }
    return 'No ingresado';
  }

  private setService(service: ServicioTrabajador) {
    this.serviceForm.setValue({
      idServicio: service.idServicio,
      fechaFinalizado: service.fechaFinalizado ? formatDate(service.fechaFinalizado, 'dd/MM/yyy HH:mm aa', 'en') : 'No ingresado',
    });

    this.serviceForm.addControl('fechaFinalizado', this.formBuilder.control(formatDate(service.fechaFinalizado!, 'yyyy-MM-ddTHH:mm:ss', 'en'), []))
    this.serviceForm.updateValueAndValidity();
    this.idService = service.idServicio;
  }

  protected updateServiceForm() {
    if (this.serviceForm.invalid) return Object.values(this.serviceForm.controls).forEach(c => c.markAsTouched());
    if (!this.serviceForm.touched) return;
    const { idServicio, ...rest } = this.serviceForm.value;
    if (idServicio) {
      Swal.fire({
        title: '¡Atención!',
        text: `¿Está seguro de la fecha y hora finalizado?\n
                ${formatDate(rest.fechaFinalizado, 'medium', 'en')}`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true
      }).then((res: any) => {
        if (res.isConfirmed) {
          return this.updateService(idServicio, rest);
        }
      });
    }
  }
}
