import { Component, OnInit } from '@angular/core';
import { CreateDepartamentoDTO, DepartamentoRelaciones, UpdateDepartamentoDTO } from 'src/app/models/departamento.model';
import { Pais } from 'src/app/models/pais.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { PaisService } from 'src/app/services/pais.service';

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

  constructor(
    private departamentoService: DepartamentoService,
    private paisService: PaisService
  ) { }

  ngOnInit(): void {
    this.getAllDepartmentsWithRelations();
    // this.loadData();
  }

  private getAllCountriesToUpdateDepartment() {
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

  private loadData() {
    this.paises.push({
      idPais: 1,
      nombre: 'Guatemala',
      codigo: 502
    },
      {
        idPais: 2,
        nombre: 'San Salvador',
        codigo: 589
      },
      {
        idPais: 3,
        nombre: 'México',
        codigo: 526
      },
      {
        idPais: 4,
        nombre: 'Bélice',
        codigo: 589
      });
    this.departamentos.push({
      idDepartamento: 1,
      nombre: 'departamento1',
      codigo: 123,
      Pais: {
        idPais: 1,
        nombre: 'Guatemala',
        codigo: 502
      }
    },
      {
        idDepartamento: 2,
        nombre: 'departamento2',
        codigo: 1234,
        Pais: {
          idPais: 2,
          nombre: 'pais2',
          codigo: 503
        }
      },
      {
        idDepartamento: 3,
        nombre: 'departamento3',
        codigo: 1233,
        Pais: null
      },
      {
        idDepartamento: 4,
        nombre: 'departamento4',
        codigo: 12345,
        Pais: {
          idPais: 4,
          nombre: 'Guatemala4',
          codigo: 505
        }
      },
      {
        idDepartamento: 5,
        nombre: 'departamento5',
        codigo: 98731,
        Pais: null
      },
    );
  }
}
