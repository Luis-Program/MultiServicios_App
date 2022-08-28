import { Component, OnInit } from '@angular/core';
import { PersonaDropdown } from 'src/app/models/persona.model';
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
  protected tiposTelefonos: TipoTelefono[] = [];
  protected personas: PersonaDropdown[] = [];
  protected loading = false;
  protected filter = "";

  constructor(
    private telefonoService: TelefonoService,
    private personaService: PersonaService,
    private tipoTelefonoService: TipoTelefonoService
  ) { }

  ngOnInit(): void {
    this.getAllPhonesWithRelationsManager();
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
    this.personaService.getAllDropDown()
      .subscribe(persons => {
        this.personas = persons;
      });
    this.tipoTelefonoService.getAll()
      .subscribe(phonestypes => {
        this.tiposTelefonos = phonestypes;
        this.loading = false;
      });
  }

  protected createPhone(dto: CreateTelefonoDTO) {
    this.loading = true;
    this.telefonoService.createManager(dto)
      .subscribe(phone => {
        if (phone) {
          this.clearInput();
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
          this.clearInput();
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
          this.clearInput();
        }
        this.loading = false;
      });
  }

  private clearInput() {
    this.filter = "";
  }

}
