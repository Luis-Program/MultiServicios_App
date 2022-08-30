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

  protected trabajadorServicios: ServiciosFinalizadosPendientes | null = null;
  protected trabajadoresMinMaxServices: TrabajadoresMinMaxServicios[] = [];
  protected tiposPersonas: TipoPersonaDropDown[] = [];
  protected persona: PersonaRelaciones | null = null;
  protected trabajador: Trabajadores | null = null;
  protected personas: PersonaRelaciones[] = [];
  protected trabajadores: Trabajadores[] = [];
  protected loadingGraphicOneWorker = false; // Carga de grafica cuando se selecciona un solo trabajador y muestra los servicios finalizados y pendientes
  protected cliente: Clientes | null = null;
  protected loadingGraphicWorker = false; // Carga de grafica cuando se traen los trabajdores con la cantidad de servicios que tienen
  protected clientes: Clientes[] = [];
  protected worker = false;
  protected amountPerson!: number;
  protected loading = false; // Carga principal
  protected tipo = 'all';
  protected filter = "";

  // CHART OPERADOR
  public gradient: boolean = true;
  public showLabels: boolean = true;
  public isDoughnut: boolean = false;
  public colorScheme: string = 'vivid';
  public chartData      !: any[];
  public showoperatorChart !: boolean;

  public Form     !: FormGroup;
  public newItem  !: boolean;
  public idItem   !: number;

  // GRAFICA DE BARRAS CHART
  public showXAxis: boolean = true;
  public showYAxis: boolean = true;
  public showXAxisLabel: boolean = true;
  public showYAxisLabel: boolean = true;
  public workersChart   !: any[];
  public showworkersChart !: boolean;
  public showLegend: boolean = true;
  public xAxisLabel!: string;
  public yAxisLabel!: string;
  public legendTitle!: string;

  constructor(
    private personaService: PersonaService,
    private tipoPersonaService: TipoPersonaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllPersonsWithRelations();
    this.getAllTypePersons();
    this.getAllClients();
    this.getAllWorkers();
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
        this.loading = false;
      });
  }

  protected getWorkersMinMax() {
    this.loadingGraphicWorker = true;
    this.personaService.getWorkersMinMaxServices()
      .subscribe(minMax => {
        this.workersChart = [
          {
            name: `${minMax[0].nombre} ${minMax[0].apellidos}`,
            value: minMax[0].cantidad
          },
          {
            name: `${minMax[1].nombre} ${minMax[1].apellidos}`,
            value: minMax[1].cantidad
          }
        ];
        this.showworkersChart = true;
        this.loadingGraphicWorker = false;
      });
  }

  protected getClientsMinMax() {
    this.loadingGraphicWorker = true;
    this.personaService.getClientsWithAmountEquipsMinMax()
      .subscribe(minMax => {
        this.workersChart = [
          {
            name: `${minMax[0].nombre} ${minMax[0].apellidos}`,
            value: minMax[0].cantidad
          },
          {
            name: `${minMax[1].nombre} ${minMax[1].apellidos}`,
            value: minMax[1].cantidad
          }
        ];
        this.showworkersChart = true;
        this.loadingGraphicWorker = false;
      });
  }

  protected changeTypePerson(tipo: string) {
    if (tipo === 'worker') {
      this.xAxisLabel = "Servicios asignados"
      this.yAxisLabel = 'Trabajadores';
      this.legendTitle = 'Trabajadores'
      this.getWorkersMinMax();
      this.tipo = tipo;
    }else  if (tipo === 'client') {
      this.xAxisLabel = 'Cantidad de equipos';
      this.yAxisLabel = 'Clientes';
      this.legendTitle = 'Clientes'
      this.getClientsMinMax();
      this.tipo = tipo;
    }else {
      this.tipo = tipo;
    }
  }

  protected get type() {
    switch (this.tipo) {
      case 'worker':
        return 'Trabajador';
      case 'client':
        return 'Cliente';
      default:
        return 'Persona'
    }
  }

  protected get amount() {
    if (this.tipo === 'worker') {
      return "Cantidad de servicios: "
    } else {
      return "Cantidad de equipos: "
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
    this.loadingGraphicOneWorker = true;
    this.personaService.getOneWorkerServicesAmount(idPersona)
      .subscribe(amount => {
        if (amount.finalizados || amount.pendientes) {
          this.chartData = [
            {
              name: 'Finalizados',
              value: amount.finalizados
            },
            {
              name: 'Pendientes',
              value: amount.pendientes
            }
          ]
          this.showoperatorChart = true;
        } else {
          this.showoperatorChart = false;
        }
        this.loadingGraphicOneWorker = false;
      });
  }

  protected createPerson(dto: CreatePersonaDTO) {
    this.loading = true;
    this.personaService.create(dto)
      .subscribe(person => {
        if (person) {
          if (this.tipo === "client" && person.tipo === "Cliente") {
            this.clientes.push(person);
          } else if (this.tipo === "worker" && person.tipo === "Trabajador Operacional") {
            this.trabajadores.push(person);
          }
          this.personas.push(person);
          this.clearInput();
          Swal.fire({
            icon: 'success',
            title: 'Creado',
            text: 'Usuario creado'
          })
        }
        this.loading = false;
      });
  }

  protected updatePerson(idPersona: number, dto: UpdatePersonaDTO) {
    this.loading = true;
    this.personaService.updateManager(idPersona, dto)
      .subscribe(res => {
        if (res) {
          this.getAllWorkers();
          this.getAllClients();
          const personIndex = this.personas.findIndex(
            (rest) => rest.idPersona === idPersona);
          this.personas[personIndex] = res;
          this.clearInput();
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Usuario actualizado'
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
          this.getAllWorkers();
          this.getAllClients();
          this.personas.splice(personIndex, 1);
          this.clearInput();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Usuario eliminado'
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
      idPersona: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      apellidos: ['', [Validators.required, Validators.maxLength(30)]],
      correo: ['', [Validators.required, Validators.email]],
      dpi: ['', [Validators.required, Validators.maxLength(20)]],
      idTipoPersona: ['', Validators.required]
    })
  }

  setForm(persona: PersonaRelaciones | Clientes | Trabajadores) {
    this.Form.setValue({
      idPersona: persona.idPersona,
      nombre: persona.nombre,
      apellidos: persona.apellidos,
      correo: persona.correo,
      dpi: persona.dpi,
      idTipoPersona: persona.idTipoPersona
    })
    this.idItem = persona.idPersona;
    if (persona.tipo === "Trabajador Operacional") {
      this.getOnePerson(persona.idPersona);
    }
  }

  openModal(persona?: PersonaRelaciones | Clientes | Trabajadores) {
    this.initForm();

    if (persona) {
      this.newItem = false;
      if (this.tipo != 'all') {
        this.amountPerson = (this.tipo != 'all') ? persona.cantidad : 0;
      }
      (persona.tipo === "Trabajador Operacional") ? this.worker = true : this.worker = false;
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
      title: '¡Atención!',
      text: '¿Está seguro de eliminar el rol?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {

      if (res.isConfirmed) {
        this.deletePerson(this.idItem);
      }

    })
  }
}
