import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonaDropdown } from 'src/app/models/persona.model';
import { CreateTelefonoDTO, TelefonoRelaciones, UpdateTelefonoDTO } from 'src/app/models/telefono.model';
import { TipoTelefono } from 'src/app/models/tipo_telefono.model';
import { PersonaService } from 'src/app/services/persona.service';
import { TelefonoService } from 'src/app/services/telefono.service';
import { TipoTelefonoService } from 'src/app/services/tipo-telefono.service';
import Swal from 'sweetalert2';

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

  protected phoneForm!: FormGroup;
  protected newPhone!: Boolean;
  protected idPhone!: number;

  constructor(
    private tipoTelefonoService: TipoTelefonoService,
    private telefonoService: TelefonoService,
    private personaService: PersonaService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllPhonesWithRelationsManager();
    this.getAllPersonsAndPhonesTypes();
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
    this.personaService.getAllDropDown()
      .subscribe(persons => {
        this.personas = persons;
      });
    this.tipoTelefonoService.getAll()
      .subscribe(phonestypes => {
        this.tiposTelefonos = phonestypes;
      });
  }

  protected createPhone(dto: CreateTelefonoDTO) {
    this.telefonoService.createManager(dto)
      .subscribe(phone => {
        if (phone) {
          this.telefonos.push(phone);
          Swal.fire({
            title: 'Creado',
            text: 'Teléfono creado',
            icon: 'success'
          });
          this.clearInput();
        }
      });
  }

  protected updatePhone(idTelefono: number, dto: UpdateTelefonoDTO) {
    this.telefonoService.updateManager(idTelefono, dto)
      .subscribe(phone => {
        if (phone) {
          const phoneIndex = this.telefonos.findIndex(
            (res) => res.idTelefono === idTelefono);
          this.telefonos[phoneIndex] = phone;
          Swal.fire({
            title: "Actualizado",
            text: "Teléfono actualizado",
            icon: 'success'
          });
          this.clearInput();
        }
      });
  }

  protected deletePhone(idTelefono: number) {
    this.telefonoService.delete(idTelefono)
      .subscribe(res => {
        if (res) {
          const phoneIndex = this.telefonos.findIndex(
            (typePerson) => typePerson.idTelefono === idTelefono);
          this.telefonos.splice(phoneIndex, 1);
          Swal.fire({
            title: 'Eliminado',
            text: 'Teléfono eliminado',
            icon: 'success'
          });
          this.clearInput();
        }
      });
  }

  protected openModalByPhone(phone?: TelefonoRelaciones) {
    this.initForm();
    if (phone) {
      this.newPhone = false;
      this.setPhone(phone);
    }
  }

  private initForm() {
    this.newPhone = true;
    this.clearInput();
    this.phoneForm = this.formBuilder.group({
      numero: ['', [Validators.required, Validators.maxLength(8)]],
      idPersona: ['', [Validators.required]],
      idTipoTelefono: ['', [Validators.required]]
    });
  }

  protected get numero() {
    return this.phoneForm.get('numero');
  }

  protected get persona() {
    return this.phoneForm.get('idPersona');
  }

  protected get tipo() {
    return this.phoneForm.get('idTipoTelefono');
  }

  private setPhone(phone: TelefonoRelaciones) {
    let idPersona, idTipoTelefono = null;
    (phone.Persona.idPersona) ? idPersona = phone.Persona.idPersona : idPersona = 0;
    (phone.Tipo_Telefono?.idTipoTelefono) ? idTipoTelefono = phone.Tipo_Telefono?.idTipoTelefono : idTipoTelefono = 0;
    this.phoneForm.setValue({
      numero: phone.numero,
      idPersona: idPersona,
      idTipoTelefono: idTipoTelefono
    });
    this.phoneForm.addControl('idTelefono', this.formBuilder.control(phone.idTelefono, []));
    this.idPhone = phone.idTelefono;
  }

  protected createPhoneForm() {
    if (this.phoneForm.invalid) return Object.values(this.phoneForm.controls).forEach(c => c.markAsTouched());
    if (!this.phoneForm.touched) return;
    const { idTelefono, ...rest } = this.phoneForm.value;
    if (idTelefono) {
      return this.updatePhone(idTelefono, rest);
    }
    return this.createPhone(rest);
  }

  protected deletePhoneModal() {
    Swal.fire({
      title: '¡Atención!',
      text: '¿Está seguro de eliminar el teléfono?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.deletePhone(this.idPhone);
      }
    });
  }

  private clearInput() {
    this.filter = "";
  }

  protected get idPersona() {
    return this.phoneForm.get('idPersona')?.value;
  }

  protected get idTipoTelefono() {
    return this.phoneForm.get('idTipoTelefono')?.value;
  }

}
