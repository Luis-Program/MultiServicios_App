import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CreateTipoRepuestoDTO, TipoRepuesto, UpdateTipoRepuestoDTO } from 'src/app/models/tipo_repuesto.model';
import { TipoRepuestoService } from 'src/app/services/tipo-repuesto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-repuesto',
  templateUrl: './tipo-repuesto.component.html',
  styleUrls: ['./tipo-repuesto.component.css']
})
export class TipoRepuestoComponent implements OnInit {

  protected tipoRepuestos: TipoRepuesto[] = [];
  protected loading = false;
  protected filter = "";

  protected typeReplacementForm!: FormGroup;
  protected newTypeReplacement!: Boolean;
  protected idTypeReplacement!: number;

  constructor(
    private tipoRepuestoService: TipoRepuestoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllReplacementType();
  }

  private getAllReplacementType() {
    this.loading = true;
    this.tipoRepuestoService.getAll()
      .subscribe(replacementTypes => {
        this.tipoRepuestos = replacementTypes;
        this.loading = false;
      });
  }

  protected createReplacementType(pais: CreateTipoRepuestoDTO) {
    this.loading = true;
    this.tipoRepuestoService.create(pais)
      .subscribe(replacementType => {
        if (replacementType) {
          this.tipoRepuestos.push(replacementType);
          Swal.fire({
            title: 'Creado',
            text: 'Rol creado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected updateReplacementType(idTipoRepuesto: number, dto: UpdateTipoRepuestoDTO) {
    this.loading = true;
    this.tipoRepuestoService.update(idTipoRepuesto, dto)
      .subscribe(res => {
        if (res) {
          const replacementTypeIndex = this.tipoRepuestos.findIndex(
            (res) => res.idTipoRepuesto === idTipoRepuesto);
          this.tipoRepuestos[replacementTypeIndex] = res;
          Swal.fire({
            title: "Actualizado",
            text: "Rol actualizado",
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected deleteReplacementType(idTipoRepuesto: number) {
    this.loading = true;
    this.tipoRepuestoService.delete(idTipoRepuesto)
      .subscribe(res => {
        if (res) {
          const replacementTypeIndex = this.tipoRepuestos.findIndex(
            (res) => res.idTipoRepuesto === idTipoRepuesto);
          this.tipoRepuestos.splice(replacementTypeIndex, 1);
          Swal.fire({
            title: 'Eliminado',
            text: 'Rol eliminado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected openModalByTypeReplacement(typeReplacement?: TipoRepuesto) {
    this.initForm();
    if (typeReplacement) {
      this.newTypeReplacement = false;
      this.setTypeReplacement(typeReplacement);
    }
  }

  private initForm() {
    this.newTypeReplacement = true;
    this.typeReplacementForm = this.formBuilder.group({
      // idTipoRepuesto: [''],
      tipo: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  private setTypeReplacement(typeReplacement: TipoRepuesto) {
    this.typeReplacementForm.setValue({
      tipo: typeReplacement.tipo
    });
    this.typeReplacementForm.addControl('idTipoRepuesto', this.formBuilder.control(typeReplacement.idTipoRepuesto, []));
    this.idTypeReplacement = typeReplacement.idTipoRepuesto;
  }

  protected createTypeReplacementForm() {
    if (this.typeReplacementForm.invalid) return Object.values(this.typeReplacementForm.controls).forEach(c => c.markAsTouched());

    if (!this.typeReplacementForm.touched) return;

    const { idTipoRepuesto, ...rest } = this.typeReplacementForm.value;

    if (idTipoRepuesto) {
      return this.updateReplacementType(idTipoRepuesto, rest);
    }

    return this.createReplacementType(this.typeReplacementForm.value);
  }

  protected deleteTypeReplacementModal() {
    Swal.fire({
      title: '¡Atención!',
      text: '¿Está seguro de eliminar el tipo de repuesto?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {

      if (res.isConfirmed) {
        this.deleteReplacementType(this.idTypeReplacement);
      }
    });
  }

  private clearInput() {
    this.filter = "";
  }

}
