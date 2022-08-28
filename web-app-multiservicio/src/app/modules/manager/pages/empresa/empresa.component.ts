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
  protected loading = false; // Carga principal
  protected loadingGraphic = false; // Carga del grafico
  protected filter = "";

  constructor(
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.getAllEnterprises();
    this.getMinMaxClient();
  }

  private getAllEnterprises() {
    this.loading = true;
    this.empresaService.getAll()
      .subscribe(enterpises => {
        this.empresas = enterpises;
        console.log(this.empresas);
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
}
