import { Component, OnInit } from '@angular/core';
import { CreateEmpresaDTO, Empresa, MinMaxEmpresa, UpdateEmpresaDTO } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  protected empresa: Empresa | null = null;
  protected empresas: Empresa[] = [];
  protected maxMinClient: MinMaxEmpresa[] = [];
  protected loading = false;

  constructor(
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.getAllEnterprises();
    this.getMinMaxClient();
    // this.loadData();
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
    this.loading = true;
    this.empresaService.getMinMaxClients()
      .subscribe(data => {
        this.maxMinClient = data;
        this.loading = false;
      });
  }

  protected createEnterprise(dto: CreateEmpresaDTO) {
    this.loading = true;
    this.empresaService.create(dto)
      .subscribe(enterprise => {
        if (enterprise) {
          // Success
          this.empresas.push(enterprise);
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
        }
        this.loading = false;
      });
  }

  private loadData() {
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

    this.maxMinClient.push({
      empresa: 'Empresa 3',
      cantidad: 32
    },
      {
        empresa: 'Empresa 1',
        cantidad: 12
      }
    );
  }
}
