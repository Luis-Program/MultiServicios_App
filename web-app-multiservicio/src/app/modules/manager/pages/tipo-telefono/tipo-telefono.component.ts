import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateTipoTelefonoDTO, TipoTelefono, UpdateTipoTelefonoDTO } from 'src/app/models/tipo_telefono.model';
import { TipoTelefonoService } from 'src/app/services/tipo-telefono.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-stelefono',
  templateUrl: './tipo-telefono.component.html',
  styleUrls: ['./tipo-telefono.component.css']
})
export class TipoTelefonoComponent implements OnInit {

  protected tiposTelefonos: TipoTelefono[] = [];
  protected loading = false;
  protected filter = "";

  protected typePhoneForm!: FormGroup;
  protected newTypePhone!: Boolean;
  protected idTypePhone!: number;

  constructor(
    private tipotelefonoService: TipoTelefonoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllPhoneTypes();
  }

  private getAllPhoneTypes() {
    this.loading = true;
    this.tipotelefonoService.getAll()
      .subscribe(phonesTypes => {
        this.tiposTelefonos = phonesTypes;
        this.loading = false;
      });
  }

  protected createPhoneTypes(dto: CreateTipoTelefonoDTO) {
    this.loading = true;
    this.tipotelefonoService.create(dto)
      .subscribe(phoneType => {
        if (phoneType) {
          this.tiposTelefonos.push(phoneType);
          Swal.fire({
            title: 'Creado',
            text: 'Tipo teléfono creado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected updatePhoneTypes(idTipoTelefono: number, dto: UpdateTipoTelefonoDTO) {
    this.loading = true;
    this.tipotelefonoService.update(idTipoTelefono, dto)
      .subscribe(phoneType => {
        if (phoneType) {
          const phoneTypeIndex = this.tiposTelefonos.findIndex(
            (res) => res.idTipoTelefono === idTipoTelefono);
          this.tiposTelefonos[phoneTypeIndex] = phoneType;
          Swal.fire({
            title: "Actualizado",
            text: "Tipo Teléfono actualizado",
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected deletePhoneTypes(idTipoTelefono: number) {
    this.loading = true;
    this.tipotelefonoService.delete(idTipoTelefono)
      .subscribe(res => {
        if (res) {
          const phoneTypeIndex = this.tiposTelefonos.findIndex(
            (phoneType) => phoneType.idTipoTelefono === idTipoTelefono);
          this.tiposTelefonos.splice(phoneTypeIndex, 1);
          Swal.fire({
            title: 'Eliminado',
            text: 'Tipo Teléfono eliminado',
            icon: 'success'
          })
          this.clearInput();
        }
        this.loading = false;
      });
  }


  protected openModalByTypePhone(typePhone?: TipoTelefono) {
    this.initForm();
    if (typePhone) {
      this.newTypePhone = false;
      this.setTypePhone(typePhone);
    }
  }

  private initForm() {
    this.newTypePhone = true;
    this.typePhoneForm = this.formBuilder.group({
      tipo: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  private setTypePhone(typePhone: TipoTelefono) {
    this.typePhoneForm.setValue({
      tipo: typePhone.tipo
    });
    this.typePhoneForm.addControl('idTipoTelefono', this.formBuilder.control(typePhone.idTipoTelefono, []));
    this.idTypePhone = typePhone.idTipoTelefono;
  }

  protected createTypePhoneForm() {
    if (this.typePhoneForm.invalid) return Object.values(this.typePhoneForm.controls).forEach(c => c.markAsTouched());
    if (!this.typePhoneForm.touched) return;
    const { idTipoTelefono, ...rest } = this.typePhoneForm.value;

    if (idTipoTelefono) {
      return this.updatePhoneTypes(idTipoTelefono, rest);
    }
    return this.createPhoneTypes(this.typePhoneForm.value);
  }

  protected deleteTypePhoneModal() {
    Swal.fire({
      title: '¡Atención!',
      text: '¿Está seguro de eliminar el tipo teléfono?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.deletePhoneTypes(this.idTypePhone);
      }
    });
  }

  private clearInput() {
    this.filter = "";
  }

}
