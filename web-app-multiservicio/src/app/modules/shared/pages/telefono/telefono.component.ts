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

  private getDataByRol() {
    if (this.rol && this.idPersona) {
      this.getAllPhonesWithRelations(this.idPersona);
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
}
