import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateTelefonoDTO, TelefonoRelacionTipoTelefono, UpdateTelefonoDTO, } from 'src/app/models/telefono.model';
import { TipoTelefono } from 'src/app/models/tipo_telefono.model';
import { TelefonoService } from 'src/app/services/telefono.service';
import { TipoTelefonoService } from 'src/app/services/tipo-telefono.service';
import Swal from 'sweetalert2';
import { getIdPersona, getRol } from '../../local-storage/localStorage';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.component.html',
  styleUrls: ['./telefono.component.css']
})
export class TelefonoComponent implements OnInit {

  private idPersona: string | null = null;
  protected telefonos: TelefonoRelacionTipoTelefono[] = [];
  protected tiposTelefonos: TipoTelefono[] = [];
  protected rol: string | null = null;
  protected loading = false;
  protected filter = "";

  protected phoneForm!: FormGroup;
  protected newPhone!: Boolean;
  protected idPhone!: number;

  constructor(
    private tipoTelefonoService: TipoTelefonoService,
    private telefonoService: TelefonoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.rol = getRol();
    this.idPersona = getIdPersona();
    this.getDataByRol();
    this.initForm();
  }

  private getDataByRol() {
    if (this.rol && this.idPersona) {
      this.getAllPhonesWithRelations(this.idPersona);
      this.getAllPhonesTypes();
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
    this.tipoTelefonoService.getAll()
      .subscribe(phonestypes => {
        this.tiposTelefonos = phonestypes;
      });
  }

  protected createPhone(dto: CreateTelefonoDTO) {
    this.telefonoService.createClientEmployee(dto)
      .subscribe(phone => {
        if (phone) {
          this.telefonos.push(phone);
          Swal.fire({
            title: 'Creado',
            text: 'Tel??fono creado',
            icon: 'success'
          });
          this.clearInput();
        }
      });
  }

  protected updatePhone(idTelefono: number, dto: UpdateTelefonoDTO) {
    this.telefonoService.updateClientEmployee(idTelefono, dto)
      .subscribe(phone => {
        if (phone) {
          const phoneIndex = this.telefonos.findIndex(
            (res) => res.idTelefono === idTelefono);
          this.telefonos[phoneIndex] = phone;
          Swal.fire({
            title: "Actualizado",
            text: "Tel??fono actualizado",
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
            text: 'Tel??fono eliminado',
            icon: 'success'
          });
          this.clearInput();
        }
      });
  }

  protected openModalByPhone(phone?: TelefonoRelacionTipoTelefono) {
    this.initForm();
    this.clearInput();
    if (phone) {
      this.newPhone = false;
      this.setPhone(phone);
    }
  }

  private initForm() {
    this.newPhone = true;
    this.phoneForm = this.formBuilder.group({
      numero: ['', [Validators.required, Validators.maxLength(8)]],
      idPersona: [this.idPersona],
      idTipoTelefono: ['', [Validators.required]]
    });
  }

  protected get numero() {
    return this.phoneForm.get('numero');
  }

  protected get tipo() {
    return this.phoneForm.get('idTipoTelefono');
  }

  private setPhone(phone: TelefonoRelacionTipoTelefono) {
    let idTipoTelefono = null;
    (phone.Tipo_Telefono?.idTipoTelefono) ? idTipoTelefono = phone.Tipo_Telefono?.idTipoTelefono : idTipoTelefono = 0;
    this.phoneForm.setValue({
      numero: phone.numero,
      idPersona: this.idPersona,
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
      title: '??Atenci??n!',
      text: '??Est?? seguro de eliminar el tel??fono?',
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

  protected get idTipoTelefono() {
    return this.phoneForm.get('idTipoTelefono')?.value;
  }

}
