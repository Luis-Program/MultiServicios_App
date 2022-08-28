import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { CreateTipoPersonaDTO, TipoPersonaRelaciones, UpdateTipoPersonaDTO } from 'src/app/models/tipo_persona.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-persona',
  templateUrl: './tipo-persona.component.html',
  styleUrls: ['./tipo-persona.component.css']
})
export class TipoPersonaComponent implements OnInit {

  protected tiposPersonas: TipoPersonaRelaciones[] = [];
  protected listaTiposPersonas = ['Gerente General','Trabajador Operacional','Cliente'];
  protected empresas: Empresa[] = [];
  protected filter = "";
  protected loading = false;

  public Form     !: FormGroup;
  public newItem  !: boolean;
  public idItem   !: number;

  constructor(
    private tipoPersonaService: TipoPersonaService,
    private empresaService: EmpresaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllTypesPersonsWithRelations();
    this.getAllEnterprises();
    this.initForm();
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

  protected createTypePerson(dto: CreateTipoPersonaDTO) {
    this.loading = true;
    this.tipoPersonaService.create(dto)
      .subscribe(typePerson => {
        if (typePerson) {
          this.clearInput();
          this.tiposPersonas.push(typePerson);
          Swal.fire({
            icon  : 'success',
            title : 'Creado',
            text  : 'Rol creado'  
          })
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
          this.clearInput();
          Swal.fire({
            icon  : 'success',
            title : 'Actualizado',
            text  : 'Rol actualizado'
          })
          // this.getAllTypesPersonsWithRelations();
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
          this.clearInput();
          Swal.fire({
            icon  : 'success',
            title : 'Eliminado',
            text  : 'Rol eliminado'
          })
        }
        this.loading = false;
      });
  }

  private clearInput() {
    this.filter = "";
  }

  showCompanyName(name: string): string {
    return (name) ? name : 'No ingresado';
  }

  initForm() {
    this.newItem = true;
    this.Form = this.fb.group({
      idTipo    : [''],
      tipo      : ['', Validators.required],
      idEmpresa : ['', Validators.required]
    })
  }

  setForm(rol: TipoPersonaRelaciones) {

    let idEmpresa = null;

    (rol.Empresa?.idEmpresa) ? idEmpresa = rol.Empresa?.idEmpresa : idEmpresa = 0;

    this.Form.setValue({
      idTipo    : rol.idTipoPersona,
      tipo      : rol.tipo,
      idEmpresa : idEmpresa
    })    

    this.idItem = rol.idTipoPersona;
  }

  openModal(rol?: TipoPersonaRelaciones) {
    this.initForm();

    if (rol) {
      this.newItem = false;
      return this.setForm(rol);
    }
  }

  createItem() {
    if (this.Form.invalid) return Object.values(this.Form.controls).forEach(c => c.markAsTouched());

    const { idTipo, ...rest } = this.Form.value;

    if (idTipo) {
      return this.updateTypePerson(idTipo, rest);
    }

    this.createTypePerson(rest);
  }

  deleteItem() {
    Swal.fire({
      title : '¡Atención!',
      text  : '¿Está seguro de eliminar el rol?',
      icon  : 'warning',
      showConfirmButton : true,
      showCancelButton  : true
    }).then((res: any) => {
      
      if (res.isConfirmed) {
        this.deleteTypePerson(this.idItem);
      }

    })
  }

  get idEmpresaValue() {
    return this.Form.get('idEmpresa')?.value;
  }
}
