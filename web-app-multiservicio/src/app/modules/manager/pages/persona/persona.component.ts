import { Component, OnInit } from '@angular/core';
import { EmpresaRelaciones } from 'src/app/models/empresa.model';
import { Clientes, CreatePersonaDTO, PersonaRelaciones, ServiciosFinalizadosPendientes, Trabajadores, TrabajadoresMinMaxServicios, UpdatePersonaDTO } from 'src/app/models/persona.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PersonaService } from 'src/app/services/persona.service';

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
  protected empresas: EmpresaRelaciones[] = [];
  protected tipo = 'all';
  protected trabajadoresMinMaxServices: TrabajadoresMinMaxServicios[] = [];
  protected trabajadorServicios: ServiciosFinalizadosPendientes | null = null;
  protected loading = false; // Carga principal
  protected loadingGraphicWorker = false; // Carga de grafica cuando se traen los trabajdores con la cantidad de servicios que tienen
  protected loadingGraphicOneWorker = false; // Carga de grafica cuando se selecciona un solo trabajador y muestra los servicios finalizados y pendientes

  constructor(
    private personaService: PersonaService,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.getAllPersonsWithRelations();
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
  protected getAllWorkers(tipo: string) {
    this.loading = true;
    this.personaService.getAllWorkersWithServices()
      .subscribe(persons => {
        this.trabajadores = persons;
        this.getWorkersMinMax();
        this.loading = false;
        this.tipo = tipo;
      });
  }

  protected getWorkersMinMax() {
    this.loadingGraphicWorker = true;
    this.personaService.getWorkersMinMaxServices()
      .subscribe(minMax => {
        this.trabajadoresMinMaxServices = minMax;
        this.loadingGraphicWorker = false;
      });
  }

  protected changeTypePerson(tipo: string) {
    if (tipo === 'worker') {
      this.getAllWorkers(tipo);
      this.tipo = tipo;
    }
    if (tipo === 'client') {
      this.getAllClients(tipo);
      this.tipo = tipo;
    }
    if (tipo === 'all') {
      this.tipo = tipo;
    }
  }

  /**
   * Clientes, [Persona, + cantidad: equipos]
   */
  protected getAllClients(tipo: string) {
    this.loading = true;
    this.personaService.getClientsWithAmountEquipsMinMax()
      .subscribe(persons => {
        this.clientes = persons;
        this.loading = false;
        this.tipo = tipo;
      });
  }

  protected getAllEnterprisesWithRelations() {
    this.loading = true;
    this.empresaService.getAllWithRelations()
      .subscribe(enterprise => {
        this.empresas = enterprise;
        this.loading = false;
      });
  }

  protected getOnePerson(idPersona: number) {
    let alter: PersonaRelaciones = this.personas.find(person => person.idPersona = idPersona) as PersonaRelaciones;
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
              this.trabajadorServicios = amount;
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
          // Success
          this.personas.push(person);
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
          // Success
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
          // Success
        }
        this.loading = false;
      });
  }

}
