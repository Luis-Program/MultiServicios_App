import { Component, OnInit } from '@angular/core';
import { Clientes, CreatePersonaDTO, PersonaRelaciones, ServiciosFinalizadosPendientes, Trabajadores, TrabajadoresMinMaxServicios, UpdatePersonaDTO } from 'src/app/models/persona.model';
import { TipoPersonaDropDown } from 'src/app/models/tipo_persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  protected persona: PersonaRelaciones | null = null;
  protected personas: PersonaRelaciones[] = [];
  protected trabajador: Trabajadores | null = null;
  protected trabajadores: Trabajadores[] = [];
  protected cliente: Clientes | null = null;
  protected clientes: Clientes[] = [];
  protected tiposPersonas: TipoPersonaDropDown[] = [];
  protected tipo = 'all';
  protected filter = "";
  protected trabajadoresMinMaxServices: TrabajadoresMinMaxServicios[] = [];
  protected trabajadorServicios: ServiciosFinalizadosPendientes | null = null;
  protected loading = false; // Carga principal
  protected loadingGraphicWorker = false; // Carga de grafica cuando se traen los trabajdores con la cantidad de servicios que tienen
  protected loadingGraphicOneWorker = false; // Carga de grafica cuando se selecciona un solo trabajador y muestra los servicios finalizados y pendientes

  // CHART OPERADOR
  public gradient       : boolean = true;
  public showLabels     : boolean = true;
  public isDoughnut     : boolean = false;
  public colorScheme    : string = 'vivid';
  public chartData      !: any[];
  public showoperatorChart !: boolean;

  public Form     !: FormGroup;
  public newItem  !: boolean;
  public idItem   !: number;

  // GRAFICA DE BARRAS CHART
  public showXAxis      : boolean = true;
  public showYAxis      : boolean = true;
  public showXAxisLabel : boolean = true;
  public xAxisLabel     : string  = 'Servicios asignados';
  public showYAxisLabel : boolean = true;
  public yAxisLabel     : string  = 'Trabajadores';
  public workersChart   !: any[];
  public showworkersChart !: boolean;
  public showLegend     : boolean = true;
  public legendTitle    : string = 'Trabajadores'

  constructor(
    private personaService: PersonaService,
    private tipoPersonaService: TipoPersonaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllPersonsWithRelations();
    this.getAllTypePersons();
    this.getWorkersMinMax();
    this.initForm();
  }

  private getAllPersonsWithRelations() {
    this.loading = true;
    this.personaService.getAllWithRelations()
      .subscribe(persons => {
        this.personas = persons;
        this.loading = false;
      });
  }

  /**
   * Trabajadores, [Persona, + cantidad: serviciosAsignados]
   */
  protected getAllWorkers() {
    this.loading = true;
    this.personaService.getAllWorkersWithServices()
      .subscribe(persons => {
        this.trabajadores = persons;
        this.getWorkersMinMax();
        this.loading = false;
        this.tipo = "worker";
      });
  }

  protected getWorkersMinMax() {
    this.loadingGraphicWorker = true;
    this.personaService.getWorkersMinMaxServices()
      .subscribe(minMax => {
        this.trabajadoresMinMaxServices = minMax;
        
        this.workersChart = [
          {
            name : `${minMax[0].persona.nombre} ${minMax[0].persona.apellidos}`,
            value: minMax[0].cantidadService
          },
          {
            name : `${minMax[1].persona.nombre} ${minMax[1].persona.apellidos}`,
            value: minMax[1].cantidadService
          }
        ];

        this.showworkersChart = true;
        
        this.loadingGraphicWorker = false;
      });
  }

  protected changeTypePerson(tipo: string) {
    if (tipo === 'worker') {
      this.getAllWorkers();
      this.tipo = tipo;
    }
    if (tipo === 'client') {
      this.getAllClients();
      this.tipo = tipo;
    }
    if (tipo === 'all') {
      this.tipo = tipo;
    }
  }

  /**
   * Clientes, [Persona, + cantidad: equipos]
   */
  protected getAllClients() {
    this.loading = true;
    this.personaService.getAllCientsEquipments()
      .subscribe(persons => {
        this.clientes = persons;
        this.loading = false;
        this.tipo = "client";
      });
  }

  protected getAllTypePersons() {
    this.loading = true;
    this.tipoPersonaService.getAllDropDown()
      .subscribe(typesPerson => {
        this.tiposPersonas = typesPerson;
        this.loading = false;
      });
  }

  protected getOnePerson(idPersona: number) {
    const personIndex = this.personas.findIndex(
      (res) => res.idPersona === idPersona);
    let alter = this.personas[personIndex];
    if (alter && alter.Tipo_Persona) {
      switch (alter.Tipo_Persona.tipo) {
        case 'Cliente':
        this.cliente = this.clientes.find(person => person.idPersona = idPersona) as Clientes;
          break;
        case 'Trabajador Operacional':
          this.loadingGraphicOneWorker = true;
          this.trabajador = this.trabajadores.find(person => person.idPersona = idPersona) as Trabajadores;
          this.personaService.getOneWorkerServicesAmount(idPersona)
            .subscribe(amount => {
              this.chartData = [
                {
                  name  : 'Finalizados',
                  value : amount.finalizados
                },
                {
                  name  : 'Pendientes',
                  value : amount.pendientes
                }
              ]
              this.showoperatorChart = true;
              this.loadingGraphicOneWorker = false;
            })
          break;
          default:
          this.persona = this.personas.find(person => person.idPersona = idPersona) as PersonaRelaciones;
          break;
      }
      // show content
    }
  }

  protected createPerson(dto: CreatePersonaDTO) {
    this.loading = true;
    this.personaService.create(dto)
      .subscribe(person => {
        if (person) {
          this.clearInput();
          this.personas.push(person);
          Swal.fire({
            icon  : 'success',
            title : 'Creado',
            text  : 'Usuario creado'
          })
        }
        this.loading = false;
      });
  }

  protected updatePerson(idPersona: number, dto: UpdatePersonaDTO) {
    this.loading = true;
    this.personaService.update(idPersona, dto)
      .subscribe(res => {
        if (res) {
          const personIndex = this.personas.findIndex(
            (res) => res.idPersona === idPersona);
          this.personas[personIndex] = res;
          this.clearInput();
          Swal.fire({
            icon  : 'success',
            title : 'Actualizado',
            text  : 'Usuario actualizado'
          })
        }
        this.loading = false;
      });
  }

  protected deletePerson(idPersona: number) {
    this.loading = true;
    this.personaService.delete(idPersona)
      .subscribe(res => {
        if (res) {
          const personIndex = this.personas.findIndex(
            (person) => person.idPersona === idPersona);
          this.personas.splice(personIndex, 1);
          this.clearInput();
          Swal.fire({
            icon  : 'success',
            title : 'Eliminado',
            text  : 'Usuario eliminado'
          })
        }
        this.loading = false;
      });
  }

  private clearInput() {
    this.filter = "";
  }

  initForm() {
    this.newItem = true;
    this.Form = this.fb.group({
      idPersona     : [''],
      nombre        : ['', [Validators.required, Validators.maxLength(30)]],
      apellidos     : ['', [Validators.required, Validators.maxLength(30)]],
      correo        : ['', [Validators.required, Validators.email]],
      dpi           : ['', [Validators.required, Validators.maxLength(20)]],
      idTipoPersona : ['', Validators.required]
    })
  }

  setForm(persona: PersonaRelaciones) {
    this.Form.setValue({
      idPersona     : persona.idPersona,
      nombre        : persona.nombre,
      apellidos     : persona.apellidos,
      correo        : persona.correo,
      dpi           : persona.dpi,
      idTipoPersona : persona.Tipo_Persona?.idTipoPersona
    })

    this.getOnePerson(persona.idPersona);
    this.idItem = persona.idPersona;
  }

  openModal(persona?: PersonaRelaciones) {
    this.initForm();

    if (persona) {
      this.newItem = false;
      return this.setForm(persona);
    }
  }

  createItem() {
    if (this.Form.invalid) return Object.values(this.Form.controls).forEach(c => c.markAsTouched());

    const { idPersona, ...rest } = this.Form.value;

    if (idPersona) {
      return this.updatePerson(idPersona, rest);
    }

    this.createPerson(rest);
  }

  deleteItem() {
    Swal.fire({
      title : '¡Atención!',
      text  : '¿Está seguro de eliminar el rol?',
      icon  : 'warning',
      showConfirmButton : true,
      showCancelButton  : true
    }).then((res: any) => {

      if (res.isConfirmed) {
        this.deletePerson(this.idItem);
      }

    })
  }
}
