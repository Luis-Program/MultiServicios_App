import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { CreateTipoPersonaDTO, TipoPersonaRelaciones, UpdateTipoPersonaDTO } from 'src/app/models/tipo_persona.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';

@Component({
  selector: 'app-tipo-persona',
  templateUrl: './tipo-persona.component.html',
  styleUrls: ['./tipo-persona.component.css']
})
export class TipoPersonaComponent implements OnInit {

  protected tipoPersona: TipoPersonaRelaciones | null = null;
  protected tiposPersonas: TipoPersonaRelaciones[] = [];
  protected listaTiposPersonas = ['Gerente General','Trabajador Operacional','Cliente'];
  protected empresas: Empresa[] = [];
  protected loading = false;

  constructor(
    private tipoPersonaService: TipoPersonaService,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.getAllTypesPersonsWithRelations();
    // this.loadData();
  }

  private getAllTypesPersonsWithRelations() {
    this.loading = true;
    this.tipoPersonaService.getAllWithRelations()
      .subscribe(typesPersons => {
        this.tiposPersonas = typesPersons;
        this.loading = false;
      });
  }

  protected getAllEnterprises() {
    this.loading = true;
    this.empresaService.getAll()
      .subscribe(enterpises => {
        this.empresas = enterpises;
        this.loading = false;
      });
  }

  protected getOneTypePerson(idTipoPersona: number) {
    this.tipoPersona = this.tiposPersonas.find(typePerson => typePerson.idTipoPersona = idTipoPersona) as TipoPersonaRelaciones;
    if (this.tipoPersona) {
      // show content
    }
  }

  protected createTypePerson(dto: CreateTipoPersonaDTO) {
    this.loading = true;
    this.tipoPersonaService.create(dto)
      .subscribe(typePerson => {
        if (typePerson) {
          // Success
          this.tiposPersonas.push(typePerson);
        }
        this.loading = false;
      });
  }

  protected updateTypePerson(idTipoPersona: number, dto: UpdateTipoPersonaDTO) {
    this.loading = true;
    this.tipoPersonaService.update(idTipoPersona, dto)
      .subscribe(res => {
        if (res) {
          const typePersonIndex = this.tiposPersonas.findIndex(
            (res) => res.idTipoPersona === idTipoPersona);
          this.tiposPersonas[typePersonIndex] = res;
          // Success
        }
        this.loading = false;
      });
  }

  protected deleteTypePerson(idTipoPersona: number) {
    this.loading = true;
    this.tipoPersonaService.delete(idTipoPersona)
      .subscribe(res => {
        if (res) {
          const typePersonIndex = this.tiposPersonas.findIndex(
            (typePerson) => typePerson.idTipoPersona === idTipoPersona);
          this.tiposPersonas.splice(typePersonIndex, 1);
          // Success
        }
        this.loading = false;
      });
  }

  private loadData() {
    this.tiposPersonas.push(
      {
        idTipoPersona: 1,
        tipo: 'Cliente',
        Empresa: {
          idEmpresa: 1,
          nombre: 'Empresa1',
          nit: '5464621'
        }
      },
      {
        idTipoPersona: 7,
        tipo: 'Cliente2',
        Empresa: null
      },
      {
        idTipoPersona: 2,
        tipo: 'Cliente',
        Empresa: {
          idEmpresa: 2,
          nombre: 'Empresa2',
          nit: '8979-87'
        }
      },
      {
        idTipoPersona: 3,
        tipo: 'Trabajador',
        Empresa: {
          idEmpresa: 3,
          nombre: 'Empresa3',
          nit: '985012-8'
        }
      },
      {
        idTipoPersona: 4,
        tipo: 'Gerente General',
        Empresa: {
          idEmpresa: 4,
          nombre: 'Empresa4',
          nit: '895745-9'
        }
      },
      {
        idTipoPersona: 9,
        tipo: 'Gerente General3',
        Empresa: null
      },
    );
    this.empresas.push({
      idEmpresa: 1,
      nombre: 'Empresa1',
      nit: '5464621'
    },
      {
        idEmpresa: 2,
        nombre: 'Empresa2',
        nit: '8979-87'
      },
      {
        idEmpresa: 3,
        nombre: 'Empresa3',
        nit: '985012-8'
      },
      {
        idEmpresa: 4,
        nombre: 'Empresa4',
        nit: '895745-9'
      }
    );

  }

}
