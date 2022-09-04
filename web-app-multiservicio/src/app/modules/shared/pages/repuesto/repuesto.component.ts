import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateRepuestoDTO, RepuestoRelaciones, UpdateRepuestoDTO } from 'src/app/models/repuesto.model';
import { TipoRepuesto } from 'src/app/models/tipo_repuesto.model';
import { RepuestoService } from 'src/app/services/repuesto.service';
import { TipoRepuestoService } from 'src/app/services/tipo-repuesto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-repuesto',
  templateUrl: './repuesto.component.html',
  styleUrls: ['./repuesto.component.css']
})
export class RepuestoComponent implements OnInit {

  protected repuestos: RepuestoRelaciones[] = [];
  protected tipoRepuestos: TipoRepuesto[] = [];
  protected idRepuesto: number | null = null;
  protected rol: string | null = null;
  protected maxValueInput! :number;
  protected loading = false;
  protected bolRol = false;  // False => Worker : True => Manager
  protected filter = "";

  protected replacementForm!: FormGroup;
  protected newReplacement!: Boolean;
  protected idReplacement!: number;

  constructor(
    private tipoRepuestoService: TipoRepuestoService,
    private repuestoService: RepuestoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.rol = localStorage.getItem('rol');
    const id = localStorage.getItem('idNoti')
    this.idRepuesto = Number(id);
    localStorage.removeItem('idNoti');
    this.getAllReplacementType();
    this.loadDataByRol();
  }

  private loadDataByRol() {
    if (this.rol) {
      this.getAllReplacementWithRelations();
      if (this.rol === 'Gerente General') {
        this.bolRol = true;
        if (this.idRepuesto) {
          this.getOneReplacement(this.idRepuesto);
        }
      }
    }
  }

  private getAllReplacementWithRelations() {
    this.loading = true;
    this.repuestoService.getAllWithRelations()
      .subscribe(replacement => {
        this.repuestos = replacement;
        this.loading = false;
      });
  }

  protected getOneReplacement(idRepuesto: number) {
    this.repuestoService.getOne(idRepuesto)
      .subscribe(replacement => {
        this.filter = replacement.nombre;
      });
  }

  protected getAllReplacementType() {
    this.loading = true;
    this.tipoRepuestoService.getAll()
      .subscribe(replacementTypes => {
        this.tipoRepuestos = replacementTypes;
        this.loading = false;
      })
  }

  protected createReplacement(repuesto: CreateRepuestoDTO) {
    this.loading = true;
    this.repuestoService.create(repuesto)
      .subscribe(replacement => {
        if (replacement) {
          this.repuestos.push(replacement);
          Swal.fire({
            title: 'Creado',
            text: 'Repuesto creado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  // Trabajador puede actualizar solo la cantidad, restarle cantidad al repuesto
  protected updateReplacement(idRepuesto: number, dto: UpdateRepuestoDTO) {
    this.loading = true;
    this.repuestoService.update(idRepuesto, dto)
      .subscribe(res => {
        if (res) {
          const replacementIndex = this.repuestos.findIndex(
            (res) => res.idRepuesto === idRepuesto);
          this.repuestos[replacementIndex] = res;
          Swal.fire({
            title: "Actualizado",
            text: "Repuesto actualizado",
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected deleteReplacement(idRepuesto: number) {
    this.loading = true;
    this.repuestoService.delete(idRepuesto)
      .subscribe(res => {
        if (res) {
          const replacementIndex = this.repuestos.findIndex(
            (res) => res.idRepuesto === idRepuesto);
          this.repuestos.splice(replacementIndex, 1);
          Swal.fire({
            title: 'Eliminado',
            text: 'Repuesto eliminado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected openModalByReplacement(replacement?: RepuestoRelaciones) {
    this.initForm();
    if (replacement) {
      this.newReplacement = false;
      this.maxValueInput = replacement.cantidadDisponible;
      this.setReplacement(replacement);
    }
  }

  private initForm() {
    this.newReplacement = true;
    this.replacementForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(25)]],
      cantidadDisponible: ['', [Validators.required]],
      limiteInferior: ['', [Validators.required]],
      idTipoRepuesto: ['', [Validators.required]]
    });
  }

  protected get nombre() {
    return this.replacementForm.get('nombre');
  }

  protected get cantidadDisponible() {
    return this.replacementForm.get('cantidadDisponible');
  }

  protected get limiteInferior() {
    return this.replacementForm.get('limiteInferior');
  }

  protected get idTipoRepuesto() {
    return this.replacementForm.get('idTipoRepuesto');
  }

  private setReplacement(replacement: RepuestoRelaciones) {
    let idTipoRepuesto = null;
    (replacement.Tipo_Repuesto?.idTipoRepuesto) ? idTipoRepuesto = replacement.Tipo_Repuesto?.idTipoRepuesto : idTipoRepuesto = 0;
    this.replacementForm.setValue({
      nombre: replacement.nombre,
      cantidadDisponible: replacement.cantidadDisponible,
      limiteInferior: replacement.limiteInferior,
      idTipoRepuesto: idTipoRepuesto
    });
    this.replacementForm.addControl('idRepuesto', this.formBuilder.control(replacement.idRepuesto, []));
    this.idReplacement = replacement.idRepuesto;
  }

  protected createReplacementForm() {
    if (this.replacementForm.invalid) return Object.values(this.replacementForm.controls).forEach(c => c.markAsTouched());
    if (!this.replacementForm.touched) return;
    const { idRepuesto, ...rest } = this.replacementForm.value;
    if (idRepuesto) {
      return this.updateReplacement(idRepuesto, rest);
    }
    return this.createReplacement(rest);
  }

  protected deleteReplacementModal() {
    Swal.fire({
      title: '¡Atención!',
      text: '¿Está seguro de eliminar repuesto?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.deleteReplacement(this.idReplacement);
      }
    });
  }

  private clearInput() {
    this.filter = "";
  }

  protected get idTipoRepuestoValue() {
    return this.replacementForm.get('idTipoRepuesto')?.value;
  }

}
