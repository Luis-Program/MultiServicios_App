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
  protected cliente: Clientes | null = null;
  protected clientes: Clientes[] = [];
  protected create: boolean = true;
  protected amountPerson!: number;
  protected loading = false; // Carga principal
  protected worker = false;
  protected tipo = 'all';
  protected filter = "";

  // CHART OPERADOR
  protected gradient: boolean = true;
  protected showLabels: boolean = true;
  protected isDoughnut: boolean = false;
  protected colorScheme: string = 'ocean';
  protected chartData      !: any[];
  protected showoperatorChart !: boolean;

  protected Form     !: FormGroup;
  protected newItem  !: boolean;
  protected idItem   !: number;

  // GRAFICA DE BARRAS CHART
  protected showXAxis: boolean = true;
  protected showYAxis: boolean = true;
  protected showXAxisLabel: boolean = true;
  protected showYAxisLabel: boolean = true;
  protected workersChart   !: any[];
  protected showworkersChart !: boolean;
  protected showLegend: boolean = true;
  protected xAxisLabel!: string;
  protected yAxisLabel!: string;
  protected legendTitle!: string;

  protected title = 'PERSONAS';

  constructor(
    private personaService: PersonaService,
    private tipoPersonaService: TipoPersonaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllPersonsWithRelations();
    this.getAllTypePersons();
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
    this.personaService.getAllWorkersWithServices()
      .subscribe(persons => {
        this.trabajadores = persons;
      });
  }

  protected getWorkersMinMax() {
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
      });
  }

  protected getClientsMinMax() {
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
      });
  }

  protected changeTypePerson(tipo: string) {
    if (tipo === 'worker') {
      this.title = "TRABAJADORES";
      this.xAxisLabel = "Servicios asignados"
      this.yAxisLabel = 'Trabajadores';
      this.legendTitle = 'Trabajadores'
      this.getWorkersMinMax();
      this.getAllWorkers();
      this.tipo = tipo;
    } else if (tipo === 'client') {
      this.title = "CLIENTES";
      this.xAxisLabel = 'Cantidad de equipos';
      this.yAxisLabel = 'Clientes';
      this.legendTitle = 'Clientes'
      this.getClientsMinMax();
      this.getAllClients();
      this.tipo = tipo;
    } else {
      this.title = 'PERSONAS';
      this.getAllPersonsWithRelations();
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
    this.personaService.getAllCientsEquipments()
      .subscribe(persons => {
        this.clientes = persons;
      });
  }

  protected getAllTypePersons() {
    this.tipoPersonaService.getAllDropDown()
      .subscribe(typesPerson => {
        this.tiposPersonas = typesPerson;
      });
  }

  protected getOnePerson(idPersona: number) {
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
      });
  }

  protected createPerson(dto: CreatePersonaDTO) {
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
      });
  }

  protected updatePerson(idPersona: number, dto: UpdatePersonaDTO) {
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
      });
  }

  protected deletePerson(idPersona: number) {
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
      });
  }

  private clearInput() {
    this.filter = "";
  }

  protected initForm() {
    this.newItem = true;
    this.Form = this.fb.group({
      idPersona: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellidos: ['', [Validators.required, Validators.maxLength(20)]],
      correo: ['', [Validators.required, Validators.email]],
      dpi: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
      idTipoPersona: ['', Validators.required]
    })
  }

  protected get nombre() {
    return this.Form.get('nombre');
  }

  protected get apellidos() {
    return this.Form.get('apellidos');
  }

  protected get correo() {
    return this.Form.get('correo');
  }

  protected get dpi() {
    return this.Form.get('dpi');
  }

  protected get tipoPersona() {
    return this.Form.get('idTipoPersona');
  }

  protected setForm(persona: PersonaRelaciones | Clientes | Trabajadores) {
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

  protected openModal(persona?: PersonaRelaciones | Clientes | Trabajadores | null, create?: boolean) {
    this.initForm();
    this.create = create ? true : false;
    if (persona) {
      this.newItem = false;
      if (this.tipo != 'all') {
        this.amountPerson = (this.tipo != 'all') ? persona.cantidad : 0;
      }
      (persona.tipo === "Trabajador Operacional") ? this.worker = true : this.worker = false;
      return this.setForm(persona);
    }
  }

  protected createItem() {
    if (this.Form.invalid) return Object.values(this.Form.controls).forEach(c => c.markAsTouched());
    const { idPersona, ...rest } = this.Form.value;
    if (idPersona) {
      return this.updatePerson(idPersona, rest);
    }
    this.createPerson(rest);
  }

  protected deleteItem() {
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
