import { Component, OnInit } from '@angular/core';
import { CreateTipoRepuestoDTO, TipoRepuesto, UpdateTipoRepuestoDTO } from 'src/app/models/tipo_repuesto.model';
import { TipoRepuestoService } from 'src/app/services/tipo-repuesto.service';

@Component({
  selector: 'app-tipo-repuesto',
  templateUrl: './tipo-repuesto.component.html',
  styleUrls: ['./tipo-repuesto.component.css']
})
export class TipoRepuestoComponent implements OnInit {

  protected tipoRepuestos: TipoRepuesto[] = [];
  protected filter = "";
  protected loading = false;

  constructor(
    private tipoRepuestoService: TipoRepuestoService
  ) { }

  ngOnInit(): void {
    this.getAllReplacementType();
  }

  private getAllReplacementType() {
    this.loading = true;
    this.tipoRepuestoService.getAll()
      .subscribe(replacementTypes => {
        this.tipoRepuestos = replacementTypes;
        this.loading = false;
      });
  }

  protected createReplacementType(pais: CreateTipoRepuestoDTO) {
    this.loading = true;
    this.tipoRepuestoService.create(pais)
      .subscribe(replacementType => {
        if (replacementType) {
          // Success
          this.tipoRepuestos.push(replacementType);
        }
        this.loading = false;
      });
  }

  protected updateReplacementType(idTipoRepuesto: number, dto: UpdateTipoRepuestoDTO) {
    this.loading = true;
    this.tipoRepuestoService.update(idTipoRepuesto, dto)
      .subscribe(res => {
        if (res) {
          const replacementTypeIndex = this.tipoRepuestos.findIndex(
            (res) => res.idTipoRepuesto === idTipoRepuesto);
          this.tipoRepuestos[replacementTypeIndex] = res;
          // Success
        }
        this.loading = false;
      });
  }

  protected deleteReplacementType(idTipoRepuesto: number) {
    this.loading = true;
    this.tipoRepuestoService.delete(idTipoRepuesto)
      .subscribe(res => {
        if (res) {
          const replacementTypeIndex = this.tipoRepuestos.findIndex(
            (res) => res.idTipoRepuesto === idTipoRepuesto);
          this.tipoRepuestos.splice(replacementTypeIndex, 1);
          // Success
        }
        this.loading = false;
      });
  }

}
