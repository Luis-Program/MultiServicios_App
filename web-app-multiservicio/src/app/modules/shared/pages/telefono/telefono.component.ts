import { Component, OnInit } from '@angular/core';
import { CreateTelefonoDTO, TelefonoRelacionTipoTelefono, UpdateTelefonoDTO, } from 'src/app/models/telefono.model';
import { TipoTelefono } from 'src/app/models/tipo_telefono.model';
import { TelefonoService } from 'src/app/services/telefono.service';
import { TipoTelefonoService } from 'src/app/services/tipo-telefono.service';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.component.html',
  styleUrls: ['./telefono.component.css']
})
export class TelefonoComponent implements OnInit {

  protected telefonos: TelefonoRelacionTipoTelefono[] = [];
  protected telefono: TelefonoRelacionTipoTelefono | null = null;
  protected tiposTelefonos: TipoTelefono[] = [];
  protected loading = false;
  protected rol: string | null = null;
  private idPersona: string | null = null;

  constructor(
    private telefonoService: TelefonoService,
    private tipoTelefonoService: TipoTelefonoService
  ) { }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    this.idPersona = localStorage.getItem('idPersona');
    this.getDataByRol();
  }

  prueba(){
    // this.getAllPhonesTypes();
    // let t: CreateTelefonoDTO = {
    //   idTipoTelefono: 2,
    //   idPersona: 19,
    //   numero: 55668899
    // }
    // this.createPhone(t)
    // let t: UpdateTelefonoDTO = {
    //   idTipoTelefono: 3,
    //   idPersona: 19,
    //   numero: 66667788
    // }
    // this.updatePhone(38, t);
    // this.deletePhone(38)
  }

  private getDataByRol() {
    if (this.rol && this.idPersona) {
      this.getAllPhonesWithRelations(this.idPersona);
      // this.loadData();
    }
  }

  private getAllPhonesWithRelations(idPersona: string | number) {
    this.loading = true;
    this.telefonoService.getAllByIdPersona(idPersona)
      .subscribe(phones => {
        this.telefonos = phones;
        this.loading = false;
      });
  }

  protected getAllPhonesTypes() {
    this.loading = true;
    this.tipoTelefonoService.getAll()
      .subscribe(phonestypes => {
        console.log(phonestypes)
        this.tiposTelefonos = phonestypes;
        this.loading = false;
      });
  }

  protected getOnePhone(idTelefono: number) {
    this.telefono = this.telefonos.find(phone => phone.idTelefono = idTelefono) as TelefonoRelacionTipoTelefono;
    if (this.telefono) {
      // show content
    }
  }

  protected createPhone(dto: CreateTelefonoDTO) {
    this.loading = true;
    this.telefonoService.createClientEmployee(dto)
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
    this.telefonoService.updateClientEmployee(idTelefono, dto)
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

  private loadData() {
    this.telefonos.push(
      {
        idTelefono: 1,
        numero: 88554466,
        idPersona: 5,
        idTipoTelefono: 1,
        Tipo_Telefono: {
          idTipoTelefono: 1,
          tipo: 'Tipo Telefono 1'
        }
      },
      {
        idTelefono: 2,
        numero: 9876546,
        idPersona: 5,
        idTipoTelefono: 1,
        Tipo_Telefono: {
          idTipoTelefono: 1,
          tipo: 'Tipo Telefono 1'
        }
      },
      {
        idTelefono: 5,
        numero: 98798,
        idPersona: 5,
        idTipoTelefono: 1,
        Tipo_Telefono: null
      },
      {
        idTelefono: 3,
        numero: 7951313,
        idPersona: 5,
        idTipoTelefono: 1,
        Tipo_Telefono: {
          idTipoTelefono: 2,
          tipo: 'Tipo Telefono 2'
        }
      },
      {
        idTelefono: 4,
        numero: 9798413,
        idPersona: 5,
        idTipoTelefono: 1,
        Tipo_Telefono: {
          idTipoTelefono: 3,
          tipo: 'Tipo Telefono 3'
        }
      },
      {
        idTelefono: 6,
        numero: 2344,
        idPersona: 5,
        idTipoTelefono: 1,
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
  }

}
