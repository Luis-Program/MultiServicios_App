import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/models/departamento.model';
import { CreateMunicipioDTO, MunicipioRelacionesAnidadas, UpdateMunicipioDTO } from 'src/app/models/municipio.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { MunicipioService } from 'src/app/services/municipio.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
  protected filter = "";

  public Form     !: FormGroup;
  public newItem  !: boolean;
  public idItem   !: number;

  constructor(
    private municipioService: MunicipioService,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllDepartmentsToUpdateMunicipality();
    this.getAllMunicipalitiesWithRelations();
    this.initForm();
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
          this.clearInput();
          this.municipios.push(municipality);
          Swal.fire({
            icon  : 'success',
            title : 'Creado',
            text  : 'Municipio creado'
          })
        }
        this.loading = false;
        this.getAllMunicipalitiesWithRelations();
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
          this.clearInput();
          Swal.fire({
            icon  : 'success',
            title : 'Actualizado',
            text  : 'Municipio actualizado'
          })
          this.getAllMunicipalitiesWithRelations();
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
          this.clearInput();
          Swal.fire({
            icon  : 'success',
            title : 'Eliminado',
            text  : 'Municipio eliminado'
          })
          this.getAllMunicipalitiesWithRelations();
        }
        this.loading = false;
      });
  }

  initForm() {
    this.newItem = true;
    this.Form = this.fb.group({
      idMunicipio: [''],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      codigo: ['', [Validators.required]],
      idDepartamento: ['', [Validators.required]]
    })
  }

  setForm(municipio: MunicipioRelacionesAnidadas) {

    let departamento = null;

    (municipio.Departamento?.idDepartamento) ? departamento = municipio.Departamento.idDepartamento : departamento = 0;

    this.Form.setValue({
      idMunicipio: municipio.idMunicipio,
      nombre: municipio.nombre,
      codigo: municipio.codigo,
      idDepartamento: departamento
    })
    this.Form.addControl('pais', this.fb.control(municipio.Departamento?.Pais?.nombre, []))
    this.idItem = municipio.idMunicipio;
  }

  openModal(municipio?: MunicipioRelacionesAnidadas) {
    this.initForm();

    if (municipio) {
      this.newItem = false;
      return this.setForm(municipio);
    }
  }

  createItem() {
    if (this.Form.invalid) return Object.values(this.Form.controls).forEach(c => c.markAsTouched());

    const { idMunicipio, pais, ...rest } = this.Form.value;

    if (idMunicipio) {
      return this.updateMunicipality(idMunicipio, rest);
    }

    this.createMunicipality(rest);
  }

  deleteItem() {
    Swal.fire({
      title : '¡Atención!',
      text  : '¿Está seguro de eliminar el municipio?',
      icon  : 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {

      if (res.isConfirmed) {
        this.deleteMunicipality(this.idItem);
      }

    })
  }

  get f() {
    return this.Form
  }

  get idMunicipio() {
    return this.Form.get('idDepartamento')?.value;
  }

  get nameCountry() {
    return this.Form.get('pais')?.value;
  }

  private clearInput(){
    this.filter = "";
  }
}
