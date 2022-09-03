import { Component, OnInit } from '@angular/core';
import { CreateDepartamentoDTO, DepartamentoRelaciones, UpdateDepartamentoDTO } from 'src/app/models/departamento.model';
import { Pais } from 'src/app/models/pais.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { PaisService } from 'src/app/services/pais.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {

  protected departamentos: DepartamentoRelaciones[] = [];
  protected pais: Pais | null = null;
  protected codeCountry!: number | null;
  protected paises: Pais[] = [];
  protected loading = false;
  protected filter = "";

  public departmentForm !: FormGroup;
  public newDepartment  !: boolean;
  public idDepartment   !: number;

  protected dropdownSettings: IDropdownSettings = {};

  constructor(
    private departamentoService: DepartamentoService,
    private paisService: PaisService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.getAllCountriesToUpdateDepartment();
    this.getAllDepartmentsWithRelations();

    this.dropdownSettings = {
      idField: 'idPais',
      textField: 'nombre',
      allowSearchFilter: true,
      limitSelection: 1,
      clearSearchFilter: true,
      noDataAvailablePlaceholderText: 'Sin datos'
    };
  }

  protected getAllCountriesToUpdateDepartment() {
    this.loading = true;
    this.paisService.getAll()
      .subscribe(countries => {
        this.paises = countries;
        this.loading = false;
      });
  }

  private getAllDepartmentsWithRelations() {
    this.loading = true;
    this.departamentoService.getAllWithRelations()
      .subscribe(departaments => {
        this.departamentos = departaments;
        this.loading = false;
      });
  }

  protected createDepartment(department: CreateDepartamentoDTO) {
    this.loading = true;
    this.departamentoService.create(department)
      .subscribe(department => {
        if (department) {
          this.clearInput();
          Swal.fire({
            icon: 'success',
            title: 'Creado',
            text: 'Departamento creado'
          })
          this.departamentos.push(department);
        }
        this.loading = false;
      });
  }

  protected updateDepartment(idDepartamento: number, dto: UpdateDepartamentoDTO) {
    this.loading = true;
    this.departamentoService.update(idDepartamento, dto)
      .subscribe(res => {
        if (res) {
          const departmentIndex = this.departamentos.findIndex(
            (res) => res.idDepartamento === idDepartamento);
          this.departamentos[departmentIndex] = res;
          this.clearInput();
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Departamento actualizado'
          })
        }
        this.loading = false;
        this.getAllDepartmentsWithRelations();
        this.getAllCountriesToUpdateDepartment();
      });
  }

  protected deleteDepartment(idDepartamento: number) {
    this.loading = true;
    this.departamentoService.delete(idDepartamento)
      .subscribe(res => {
        if (res) {
          const departmentIndex = this.departamentos.findIndex(
            (res) => res.idDepartamento === idDepartamento);
          this.departamentos.splice(departmentIndex, 1);
          this.clearInput();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Departamento eliminado'
          })
        }
        this.loading = false;
      });
  }

  /**
   * INIT DEPARTMENT FORM
   */
  protected initForm() {
    this.newDepartment = true;
    this.departmentForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      codigo: ['', [Validators.required]],
      idPais: ['', [Validators.required]]
    })
  }

  protected setDepartmentForm(department: DepartamentoRelaciones) {

    let pais = null;

    (department.Pais?.idPais) ? pais = department.Pais.idPais : pais = 0;

    this.departmentForm.setValue({
      nombre: department.nombre,
      codigo: department.codigo,
      idPais: pais
    })

    this.departmentForm.addControl('idDepartamento', this.fb.control(department.idDepartamento, []));
    this.idDepartment = department.idDepartamento;

    if (pais >= 1) {
      this.departmentForm.addControl('codeCountry', this.fb.control(department.Pais?.codigo))
    }

  }

  /**
   *
   * @param department - <DepartamentoRelaciones> Department to update/delete
   */
  protected openModalByDepartment(department?: DepartamentoRelaciones) {
    this.initForm();
    this.listenCountry();

    if (department) {
      this.newDepartment = false;
      this.codeCountry = (department.Pais) ? department.Pais.codigo : null;
      return this.setDepartmentForm(department);
    }
  }

  protected createDepartmentForm() {
    if (this.departmentForm.invalid) return Object.values(this.departmentForm.controls).forEach(c => c.markAsTouched());

    if (!this.departmentForm.touched) return;

    const { idDepartamento, codeCountry, ...rest } = this.departmentForm.value;

    if (idDepartamento) {
      return this.updateDepartment(idDepartamento, rest);
    }

    this.createDepartment(rest);
  }

  protected deleteDepartmentModal() {
    Swal.fire({
      title: '¡Atención!',
      text: '¿Está seguro de eliminar el departamento?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {

      if (res.isConfirmed) {
        this.deleteDepartment(this.idDepartment);
      }

    })
  }

  protected get f() {
    return this.departmentForm;
  }

  protected get nameControl() {
    return this.departmentForm.get('nombre');
  }

  protected get codeControl() {
    return this.departmentForm.get('codigo');
  }

  protected get country() {
    return this.departmentForm.get('idPais');
  }

  protected get idCountryValue() {
    return this.departmentForm.get('idPais')?.value;
  }

  protected listenCountry() {
    this.departmentForm.get('idPais')?.valueChanges.subscribe(res => {

      const country = this.departamentos.find(department => department.Pais?.idPais == res) as DepartamentoRelaciones;

      const countryControl = this.f.get('codeCountry');

      if (!countryControl && country) {
        this.departmentForm.addControl('codeCountry', this.fb.control(country.Pais?.codigo, []))
      } else if (countryControl && !country) {
        this.departmentForm.get('codeCountry')?.setValue('')
      } else if (countryControl && country) {
        this.departmentForm.get('codeCountry')?.setValue(country.Pais?.codigo);
      }

    })
  }

  protected onItemSelect(item: any) {
    console.log("idPais: " + item.idPais);
  }

  private clearInput() {
    this.filter = "";
  }

  // 1. Hacemos referencia al control utilizando getters - get miControl
  // 2. Creamos un div con las condiciones si el control es invalido/tocado - miControl?.invalid && miControl.touched
  // 3. Validaciones específicas como requeridas o carácteres máxuimos  - miControl?.hasError('maxlength')
  // 4. Agregamos clase - class="text-danger
}
