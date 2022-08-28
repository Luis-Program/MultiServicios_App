import { Component, OnInit } from '@angular/core';
import { CreateEmpresaDTO, Empresa, MinMaxEmpresa, UpdateEmpresaDTO } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  protected empresas: Empresa[] = [];
  protected maxMinClient: MinMaxEmpresa[] = [];
  protected loading = false; // Carga principal
  protected loadingGraphic = false; // Carga del grafico
  protected filter = "";

  public Form     !: FormGroup;
  public newItem  !: boolean;
  public idItem   !: number;

  // CHARTS
  public showXAxis      : boolean = true;
  public showYAxis      : boolean = true;
  public gradient       : boolean = true;
  public showLegend     : boolean = true;
  public showYAxisLabel : boolean = true;
  public yAxisLabel     : string  = 'Estadísticas de empresas';
  public colorScheme    : string  = 'vivid';
  public legendTitle    : string  = 'Empresas';
  public single         !: any[];

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllEnterprises();
    this.getMinMaxClient();
    this.initForm();
  }

  private getAllEnterprises() {
    this.loading = true;
    this.empresaService.getAll()
      .subscribe(enterpises => {
        this.empresas = enterpises;
        this.loading = false;
      });
  }

  private getMinMaxClient() {
    // Becomes the max first then min
    this.loadingGraphic = true;
    this.empresaService.getMinMaxClients()
      .subscribe((data: MinMaxEmpresa[]) => {
        this.single = data.map(c => {
          return {
            name  : c.empresa,
            value : c.cantidad
          }
        })
        
        this.loadingGraphic = false;
      });
  }

  protected createEnterprise(dto: CreateEmpresaDTO) {
    this.loading = true;
    this.empresaService.create(dto)
      .subscribe(enterprise => {
        if (enterprise) {
          // Success
          this.empresas.push(enterprise);
          Swal.fire({
            icon  : 'success',
            title : 'Creado',
            text  : 'Empresa creada'
          })
          this.getAllEnterprises();
        }
        this.loading = false;
      });
  }

  protected updateEnterprise(idEmpresa: number, dto: UpdateEmpresaDTO) {
    this.loading = true;
    this.empresaService.update(idEmpresa, dto)
      .subscribe(res => {
        if (res) {
          const enterpriseIndex = this.empresas.findIndex(
            (res) => res.idEmpresa === idEmpresa);
          this.empresas[enterpriseIndex] = res;
          // Success
          Swal.fire({
            icon  : 'success',
            title : 'Actualizado',
            text  : 'Empresa actualizada'
          })
          this.getAllEnterprises();
        }
        this.loading = false;
      });
  }

  protected deleteEnterprise(idEmpresa: number) {
    this.loading = true;
    this.empresaService.delete(idEmpresa)
      .subscribe(res => {
        if (res) {
          const enterpriseIndex = this.empresas.findIndex(
            (enterprise) => enterprise.idEmpresa === idEmpresa);
          this.empresas.splice(enterpriseIndex, 1);
          // Success
          Swal.fire({
            icon  : 'success',
            title : 'Eliminado',
            text  : 'Empresa eliminada'
          })
          this.getAllEnterprises();
        }
        this.loading = false;
      });
  }

  initForm() {
    this.newItem = true;
    this.Form = this.fb.group({
      idEmpresa : [''],
      nombre    : ['', [Validators.required, Validators.maxLength(45)]],
      nit       : ['', [Validators.required, Validators.maxLength(20)]] 
    })
  }

  setForm(empresa: Empresa) {
    
    this.Form.setValue({
      idEmpresa : empresa.idEmpresa,
      nombre    : empresa.nombre,
      nit       : empresa.nit
    })

    this.idItem = empresa.idEmpresa;
  }

  openModal(empresa?: Empresa) {
    this.initForm();

    if (empresa) {
      this.newItem = false;
      return this.setForm(empresa);
    }
  }

  createItem() {
    if (this.Form.invalid) return Object.values(this.Form.controls).forEach(c => c.markAsTouched());

    const { idEmpresa, ...rest } = this.Form.value;

    if (idEmpresa) {
      return this.updateEnterprise(idEmpresa, rest);
    }

    this.createEnterprise(rest)
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
        this.deleteEnterprise(this.idItem);
      }

    })
  }
}