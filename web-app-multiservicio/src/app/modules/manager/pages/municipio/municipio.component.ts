import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/models/departamento.model';
import { CreateMunicipioDTO, MunicipioRelacionesAnidadas, UpdateMunicipioDTO } from 'src/app/models/municipio.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { MunicipioService } from 'src/app/services/municipio.service';

@Component({
  selector: 'app-municipio',
  templateUrl: './municipio.component.html',
  styleUrls: ['./municipio.component.css']
})
export class MunicipioComponent implements OnInit {

  protected municipio: MunicipioRelacionesAnidadas | null = null;
  protected municipios: MunicipioRelacionesAnidadas[] = [];
  protected departamentos: Departamento[] = [];
  protected loading = false;

  constructor(
    private municipioService: MunicipioService,
    private departamentoService: DepartamentoService
  ) { }

  ngOnInit(): void {
    this.getAllMunicipalitiesWithRelations();
    // this.loadData();
  }

  protected getAllDepartmentsToUpdateMunicipality() {
    this.loading = true;
    this.departamentoService.getAll()
      .subscribe(departments => {
        this.departamentos = departments;
        this.loading = false;
      });
  }

  private getAllMunicipalitiesWithRelations() {
    this.loading = true;
    this.municipioService.getAllWithRelations()
      .subscribe(municipalities => {
        this.municipios = municipalities;
        this.loading = false;
      });
  }

  protected getOneMunicipality(idMunicipio: number) {
    this.municipio = this.municipios.find(municipality => municipality.idMunicipio = idMunicipio) as MunicipioRelacionesAnidadas;
    if (this.municipio) {
      // show content
    }
  }

  protected createMunicipality(municipio: CreateMunicipioDTO) {
    this.loading = true;
    this.municipioService.create(municipio)
      .subscribe(municipality => {
        if (municipality) {
          // Success
          this.municipios.push(municipality);
        }
        this.loading = false;
      });
  }

  protected updateMunicipality(idMunicipio: number, dto: UpdateMunicipioDTO) {
    this.loading = true;
    this.municipioService.update(idMunicipio, dto)
      .subscribe(res => {
        if (res) {
          const municipalityIndex = this.municipios.findIndex(
            (res) => res.idMunicipio === idMunicipio);
          this.municipios[municipalityIndex] = res;
          // Success
        }
        this.loading = false;
      });
  }

  protected deleteMunicipality(idMunicipio: number) {
    this.loading = true;
    this.municipioService.delete(idMunicipio)
      .subscribe(res => {
        if (res) {
          const municipalityIndex = this.municipios.findIndex(
            (municipality) => municipality.idMunicipio === idMunicipio);
          this.municipios.splice(municipalityIndex, 1);
          // Success
        }
        this.loading = false;
      });
  }

  private loadData() {
    this.departamentos.push({
      idDepartamento: 1,
      nombre: 'departamento1',
      codigo: 123,
      idPais: 1
    },
      {
        idDepartamento: 2,
        nombre: 'departamento2',
        codigo: 1234,
        idPais: 2,
      },
      {
        idDepartamento: 3,
        nombre: 'departamento3',
        codigo: 1233,
        idPais: 3,
      },
      {
        idDepartamento: 4,
        nombre: 'departamento4',
        codigo: 12345,
        idPais: 4,
      },
    );

    this.municipios.push({
      idMunicipio: 1,
      nombre: 'municipio1',
      codigo: 1,
      Departamento: {
        idDepartamento: 4,
        nombre: 'departamento4',
        codigo: 12345,
        Pais: {
          idPais: 1,
          nombre: 'Guatemala',
          codigo: 502
        }
      }
    },
      {
        idMunicipio: 32,
        nombre: 'municipio32',
        codigo: 32,
        Departamento: {
          idDepartamento: 3,
          nombre: 'departamento3',
          codigo: 3,
          Pais: null
        }
      },
      {
        idMunicipio: 10,
        nombre: 'municipio10',
        codigo: 5,
        Departamento: null
      },
      {
        idMunicipio: 2,
        nombre: 'municipio2',
        codigo: 2,
        Departamento: {
          idDepartamento: 2,
          nombre: 'departamento2',
          codigo: 2,
          Pais: {
            idPais: 1,
            nombre: 'Guatemala',
            codigo: 502
          }
        }
      },
      {
        idMunicipio: 3,
        nombre: 'municipio3',
        codigo: 3,
        Departamento: {
          idDepartamento: 3,
          nombre: 'departamento3',
          codigo: 3,
          Pais: {
            idPais: 1,
            nombre: 'Guatemala',
            codigo: 502
          }
        }
      },
      {
        idMunicipio: 14,
        nombre: 'municipio14',
        codigo: 98,
        Departamento: null
      },
      {
        idMunicipio: 4,
        nombre: 'municipio4',
        codigo: 4,
        Departamento: {
          idDepartamento: 4,
          nombre: 'departamento4',
          codigo: 12345,
          Pais: {
            idPais: 1,
            nombre: 'Guatemala',
            codigo: 502
          }
        }
      },
      {
        idMunicipio: 39,
        nombre: 'municipio35',
        codigo: 37,
        Departamento: {
          idDepartamento: 6,
          nombre: 'departamento6',
          codigo: 6,
          Pais: null
        }
      }
    );
  }

}
