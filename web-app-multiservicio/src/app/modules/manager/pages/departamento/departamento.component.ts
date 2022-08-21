import { Component, OnInit } from '@angular/core';
import { CreateDepartamentoDTO, DepartamentoRelaciones, UpdateDepartamentoDTO } from 'src/app/models/departamento.model';
import { Pais } from 'src/app/models/pais.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { PaisService } from 'src/app/services/pais.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {

  protected departamento: DepartamentoRelaciones | null = null;
  protected departamentos: DepartamentoRelaciones[] = [];
  protected paises: Pais[] = [];
  protected loading = false;

  public departmentForm !: FormGroup;
  public newDepartment  !: boolean;
  public idDepartment   !: number;

  constructor(
    private departamentoService: DepartamentoService,
    private paisService: PaisService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllDepartmentsWithRelations();
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

  protected getOneDepartment(idDepartamento: number) {
    this.departamento = this.departamentos.find(department => department.idDepartamento = idDepartamento) as DepartamentoRelaciones;
    if (this.departamento) {
      // show content
    }
  }

  protected createDepartment(department: CreateDepartamentoDTO) {
    this.loading = true;
    this.departamentoService.create(department)
      .subscribe(department => {
        if (department) {
          // Success
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
          // Success
        }
        this.loading = false;
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
          // Success
        }
        this.loading = false;
      });
  }

  initForm() {
    this.departmentForm = this.fb.group({

    })
  }

  openModalByDepartment(department?: DepartamentoRelaciones) {
    console.log(department);
  }
}
