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
  protected loading = false;

  constructor(
    private personaService: PersonaService,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.getAllPersonsWithRelations();
    // this.loadData();
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
    this.personaService.getWorkersMinMaxServices()
      .subscribe(minMax => {
        this.trabajadoresMinMaxServices = minMax;
      });
  }

  protected changeTypePerson(tipo: string) {
    if (tipo === 'worker') {
      // this.getAllWorkers(tipo);
      this.loadWorker();
      this.tipo = tipo;
    }
    if (tipo === 'client') {
      // this.getAllClients(tipo);
      this.loadClient();
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
          this.trabajador = this.trabajadores.find(person => person.idPersona = idPersona) as Trabajadores;
          this.personaService.getOneWorkerServicesAmount(idPersona)
            .subscribe(amount => {
              this.trabajadorServicios = amount;
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

  private loadData() {
    this.personas.push({
      idPersona: 1,
      nombre: 'Juan',
      apellidos: 'Pedro',
      correo: 'juanpedro@email.com',
      dpi: '65464631',
      Tipo_Persona: {
        idTipoPersona: 1,
        tipo: 'Cliente',
        Empresa: {
          idEmpresa: 1,
          nombre: 'Empresa 1',
          nit: '213132'
        }
      },
    },
      {
        idPersona: 2,
        nombre: 'Maria',
        apellidos: 'Fernanda',
        correo: 'mariafernanda@email.com',
        dpi: '36487931',
        Tipo_Persona: {
          idTipoPersona: 2,
          tipo: 'Trabajador Operacional',
          Empresa: {
            idEmpresa: 1,
            nombre: 'Empresa 2',
            nit: '9876513169'
          }
        },
      },
      {
        idPersona: 3,
        nombre: 'Pablo',
        apellidos: 'Martinez',
        correo: 'pablomartinez@email.com',
        dpi: '798413',
        Tipo_Persona: {
          idTipoPersona: 3,
          tipo: 'Gerente',
          Empresa: {
            idEmpresa: 4,
            nombre: 'Empresa 4',
            nit: '579831'
          }
        },
      },
      {
        idPersona: 4,
        nombre: 'Luis',
        apellidos: 'Alberto',
        correo: 'luisalberto@email.com',
        dpi: '87965464',
        Tipo_Persona: {
          idTipoPersona: 1,
          tipo: 'Cliente',
          Empresa: {
            idEmpresa: 1,
            nombre: 'Empresa 1',
            nit: '213132'
          }
        },
      }
    );

    this.empresas.push({
      idEmpresa: 1,
      nombre: 'empresa 1',
      nit: '6798431',
      Tipo_Persona: [
        {
          idTipoPersona: 1,
          tipo: 'Cliente',
          idEmpresa: 1
        },
        {
          idTipoPersona: 2,
          tipo: 'Trabajador',
          idEmpresa: 1
        },
        {
          idTipoPersona: 3,
          tipo: 'Gerente',
          idEmpresa: 1
        }
      ]
    },
      {
        idEmpresa: 2,
        nombre: 'empresa d',
        nit: '794313',
        Tipo_Persona: [
          {
            idTipoPersona: 4,
            tipo: 'Cliente',
            idEmpresa: 2
          }
        ]
      },
      {
        idEmpresa: 3,
        nombre: 'empresa 3',
        nit: '987983',
        Tipo_Persona: [
          {
            idTipoPersona: 5,
            tipo: 'Cliente',
            idEmpresa: 3
          }
        ]
      });
  }

  loadClient() {
    this.clientes.push({
      idPersona: 1,
      cantidad: 12,
      nombre: 'Juan',
      apellidos: 'Pedro',
      correo: 'juanpedro@email.com',
      dpi: '5456132',
      idTipoPersona: 1
    },
      {
        idPersona: 2,
        cantidad: 10,
        nombre: 'Maria',
        apellidos: 'Fernanda',
        correo: 'mariafernanda@email.com',
        dpi: '36487931',
        idTipoPersona: 2
      },
      {
        idPersona: 3,
        cantidad: 4,
        nombre: 'Pablo',
        apellidos: 'Martinez',
        correo: 'pablomartinez@email.com',
        dpi: '798413',
        idTipoPersona: 3
      },
      {
        idPersona: 4,
        cantidad: 1,
        nombre: 'Luis',
        apellidos: 'Alberto',
        correo: 'luisalberto@email.com',
        dpi: '031654',
        idTipoPersona: 4
      });
  }

  loadWorker() {
    this.trabajadores.push({
      idPersona: 1,
      cantidad: 12,
      nombre: 'Juan Trabajador',
      apellidos: 'Pedro Trabajador',
      correo: 'juanpedro@email.com',
      dpi: '03136543',
      idTipoPersona: 1
    },
      {
        idPersona: 2,
        cantidad: 10,
        nombre: 'Maria Trabajador',
        apellidos: 'Fernanda Trabajador',
        correo: 'mariafernanda@email.com',
        dpi: '111223',
        idTipoPersona: 2
      },
      {
        idPersona: 3,
        cantidad: 4,
        nombre: 'Pablo Trabajador',
        apellidos: 'Martinez Trabajador',
        correo: 'pablomartinez@email.com',
        dpi: '654765132',
        idTipoPersona: 3
      },
      {
        idPersona: 4,
        cantidad: 1,
        nombre: 'Luis Trabajador',
        apellidos: 'Alberto Trabajador',
        correo: 'luisalberto@email.com',
        dpi: '5449843',
        idTipoPersona: 4
      });

    this.trabajadoresMinMaxServices.push({
      cantidadService: 33,
      persona: {
        idPersona: 4,
        nombre: 'Luis Trabajador',
        apellidos: 'Alberto Trabajador',
        correo: 'luisalberto@email.com',
        dpi: '5449843',
        idTipoPersona: 4
      }
    },
      {
        cantidadService: 10,
        persona: {
          idPersona: 1,
          nombre: 'Juan Trabajador',
          apellidos: 'Pedro Trabajador',
          correo: 'juanpedro@email.com',
          dpi: '03136543',
          idTipoPersona: 1
        }
      });
  }

}
