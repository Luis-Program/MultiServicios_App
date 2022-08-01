import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/models/persona.model';
import { CreateTelefonoDTO, TelefonoRelaciones, UpdateTelefonoDTO } from 'src/app/models/telefono.model';
import { TipoTelefono } from 'src/app/models/tipo_telefono.model';
import { PersonaService } from 'src/app/services/persona.service';
import { TelefonoService } from 'src/app/services/telefono.service';
import { TipoTelefonoService } from 'src/app/services/tipo-telefono.service';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.component.html',
  styleUrls: ['./telefono.component.css']
})
export class TelefonoComponent implements OnInit {

  protected telefonos: TelefonoRelaciones[] = [];
  protected telefono: TelefonoRelaciones | null = null;
  protected tiposTelefonos: TipoTelefono[] = [];
  protected personas: Persona[] = [];
  protected loading = false;
  constructor(
    private telefonoService: TelefonoService,
    private personaService: PersonaService,
    private tipoTelefonoService: TipoTelefonoService
  ) { }

  ngOnInit(): void {
    this.getAllPhonesWithRelationsManager();
    // this.loadDataManager();
  }

  private getAllPhonesWithRelationsManager() {
    this.loading = true;
    this.telefonoService.getAllWithRelations()
      .subscribe(phones => {
        this.telefonos = phones;
        this.loading = false;
      });
  }

  protected getAllPersonsAndPhonesTypes() {
    this.loading = true;
    this.personaService.getAll()
      .subscribe(persons => {
        this.personas = persons;
      });
    this.tipoTelefonoService.getAll()
      .subscribe(phonestypes => {
        this.tiposTelefonos = phonestypes;
        this.loading = false;
      });
  }

  protected getOnePhone(idTelefono: number) {
    this.telefono = this.telefonos.find(phone => phone.idTelefono = idTelefono) as TelefonoRelaciones;
    if (this.telefono) {
      // show content
    }
  }

  protected createPhone(dto: CreateTelefonoDTO) {
    this.loading = true;
    this.telefonoService.createManager(dto)
      .subscribe(phone => {
        if (phone) {
          // Success
          this.telefonos.push(phone);
        }
        this.loading = false;
      });
  }

  protected updatePhone(idTelefono: number, dto: UpdateTelefonoDTO) {
    this.loading = true;
    this.telefonoService.updateManager(idTelefono, dto)
      .subscribe(phone => {
        if (phone) {
          const phoneIndex = this.telefonos.findIndex(
            (res) => res.idTelefono === idTelefono);
          this.telefonos[phoneIndex] = phone;
          // Success
        }
        this.loading = false;
      });
  }

  protected deletePhone(idTelefono: number) {
    this.loading = true;
    this.telefonoService.delete(idTelefono)
      .subscribe(res => {
        if (res) {
            const phoneIndex = this.telefonos.findIndex(
              (typePerson) => typePerson.idTelefono === idTelefono);
            this.telefonos.splice(phoneIndex, 1);
            // Success
        }
        this.loading = false;
      });
  }

  private loadDataManager() {
    this.telefonos.push(
      {
        idTelefono: 1,
        numero: 88554466,
        Persona: {
          idPersona: 1,
          nombre: 'Luis',
          apellidos: 'Cáceres',
          correo: 'luiscaceres@gmail.com',
          dpi: '1231564647894',
          idTipoPersona: 1
        },
        Tipo_Telefono: {
          idTipoTelefono: 1,
          tipo: 'Tipo Telefono 1'
        }
      },
      {
        idTelefono: 2,
        numero: 9876546,
        Persona: {
          idPersona: 1,
          nombre: 'Luis',
          apellidos: 'Cáceres',
          correo: 'luiscaceres@gmail.com',
          dpi: '1231564647894',
          idTipoPersona: 1
        },
        Tipo_Telefono: {
          idTipoTelefono: 1,
          tipo: 'Tipo Telefono 1'
        }
      },
      {
        idTelefono: 5,
        numero: 98798,
        Persona: {
          idPersona: 3,
          nombre: 'Astrid',
          apellidos: 'Fernandez',
          correo: 'fernandesAstrin@gmail.com',
          dpi: '879132165',
          idTipoPersona: 3
        },
        Tipo_Telefono: null
      },
      {
        idTelefono: 3,
        numero: 7951313,
        Persona: {
          idPersona: 2,
          nombre: 'Pablo',
          apellidos: 'Gutierrez',
          correo: 'gutiPablo@gmail.com',
          dpi: '7983213',
          idTipoPersona: 2
        },
        Tipo_Telefono: {
          idTipoTelefono: 2,
          tipo: 'Tipo Telefono 2'
        }
      },
      {
        idTelefono: 4,
        numero: 9798413,
        Persona: {
          idPersona: 3,
          nombre: 'Astrid',
          apellidos: 'Fernandez',
          correo: 'fernandesAstrin@gmail.com',
          dpi: '879132165',
          idTipoPersona: 3
        },
        Tipo_Telefono: {
          idTipoTelefono: 3,
          tipo: 'Tipo Telefono 3'
        }
      },
      {
        idTelefono: 6,
        numero: 2344,
        Persona: {
          idPersona: 3,
          nombre: 'Astrid',
          apellidos: 'Fernandez',
          correo: 'fernandesAstrin@gmail.com',
          dpi: '879132165',
          idTipoPersona: 3
        },
        Tipo_Telefono: null
      },
    );
    this.tiposTelefonos.push(
      {
        idTipoTelefono: 1,
        tipo: 'Tipo Telefono 1'
      },
      {
        idTipoTelefono: 2,
        tipo: 'Tipo Telefono 2'
      },
      {
        idTipoTelefono: 3,
        tipo: 'Tipo Telefono 3'
      },
      {
        idTipoTelefono: 4,
        tipo: 'Tipo Telefono 4'
      }, {
      idTipoTelefono: 5,
      tipo: 'Tipo Telefono 5'
    }
    );

    this.personas.push(
      {
        idPersona: 1,
        nombre: 'Luis',
        apellidos: 'Cáceres',
        correo: 'luiscaceres@gmail.com',
        dpi: '1231564647894',
        idTipoPersona: 1
      },
      {
        idPersona: 2,
        nombre: 'Pablo',
        apellidos: 'Gutierrez',
        correo: 'gutiPablo@gmail.com',
        dpi: '7983213',
        idTipoPersona: 2
      },
      {
        idPersona: 3,
        nombre: 'Astrid',
        apellidos: 'Fernandez',
        correo: 'fernandesAstrin@gmail.com',
        dpi: '879132165',
        idTipoPersona: 3
      },
      {
        idPersona: 4,
        nombre: 'Maria',
        apellidos: 'Sanchez',
        correo: 'sanchmaria@gmail.com',
        dpi: '2123464',
        idTipoPersona: 5
      }
    );
  }

}
