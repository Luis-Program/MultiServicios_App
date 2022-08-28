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

  protected empresa: Empresa | null = null;
  protected empresas: Empresa[] = [];
  protected maxMinClient: MinMaxEmpresa[] = [];
  protected loading = false; // Carga principal
  protected loadingGraphic = false; // Carga del grafico
  protected filter = "";

  public Form     !: FormGroup;
  public newItem  !: boolean;
  public idItem   !: number;

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

  protected getOneEnterprise(idEmpresa: number) {
    this.empresa = this.empresas.find(enterprise => enterprise.idEmpresa = idEmpresa) as Empresa;
    if (this.empresa) {
      // show content
    }
  }

  private getMinMaxClient() {
    // Becomes the max first then min
    this.loadingGraphic = true;
    this.empresaService.getMinMaxClients()
      .subscribe(data => {
        this.maxMinClient = data;
        console.log(this.maxMinClient);
        
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

  single: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];
  multi !: any[];

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = 'vivid'

  onSelect(event: any) {
    console.log(event);
  }
}