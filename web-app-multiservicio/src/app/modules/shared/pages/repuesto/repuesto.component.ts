import { Component, OnInit } from '@angular/core';
import { CreateRepuestoDTO, RepuestoRelaciones, UpdateRepuestoDTO } from 'src/app/models/repuesto.model';
import { TipoRepuesto } from 'src/app/models/tipo_repuesto.model';
import { RepuestoService } from 'src/app/services/repuesto.service';
import { TipoRepuestoService } from 'src/app/services/tipo-repuesto.service';

@Component({
  selector: 'app-repuesto',
  templateUrl: './repuesto.component.html',
  styleUrls: ['./repuesto.component.css']
})
export class RepuestoComponent implements OnInit {

  protected repuestos: RepuestoRelaciones[] = [];
  protected tipoRepuestos: TipoRepuesto[] = [];
  protected rol: string | null = null;
  protected idRepuesto: number | null = null;
  protected loading = false;
  protected filter = "";

  constructor(
    private tipoRepuestoService: TipoRepuestoService,
    private repuestoService: RepuestoService
  ) { }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    const id = localStorage.getItem('idNoti')
    this.idRepuesto = Number(id);
    localStorage.removeItem('idNoti');
    this.loadDataByRol();
  }

  private loadDataByRol() {
    if (this.rol) {
      if (this.rol === 'Gerente General') {
        this.getAllReplacementWithRelations();
        if (this.idRepuesto) {
          this.getOneReplacement(this.idRepuesto);
        }
      } else if (this.rol === 'Trabajador Operacional') {
        // Only can read and update
        this.getAllReplacementWithRelations();
      }
    }
  }

  private getAllReplacementWithRelations() {
    this.loading = true;
    this.repuestoService.getAllWithRelations()
      .subscribe(replacement => {
        this.repuestos = replacement;
        this.loading = false;
      });
  }

  protected getOneReplacement(idRepuesto: number) {
    this.repuestoService.getOne(idRepuesto)
    .subscribe(replacement => {
      this.filter = replacement.nombre;
    });
  }

  protected getAllReplacementType() {
    this.loading = true;
    this.tipoRepuestoService.getAll()
      .subscribe(replacementTypes => {
        this.tipoRepuestos = replacementTypes;
        this.loading = false;
      })
  }

  protected createReplacement(repuesto: CreateRepuestoDTO) {
    this.loading = true;
    this.repuestoService.create(repuesto)
      .subscribe(replacement => {
        if (replacement) {
          this.repuestos.push(replacement);
          this.clearInput();
        }
        this.loading = false;
      });
  }

  // Trabajador puede actualizar solo la cantidad, restarle cantidad al repuesto
  protected updateReplacement(idRepuesto: number, dto: UpdateRepuestoDTO) {
    this.loading = true;
    this.repuestoService.update(idRepuesto, dto)
      .subscribe(res => {
        if (res) {
          const replacementIndex = this.repuestos.findIndex(
            (res) => res.idRepuesto === idRepuesto);
          this.repuestos[replacementIndex] = res;
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected deleteReplacement(idRepuesto: number) {
    this.loading = true;
    this.repuestoService.delete(idRepuesto)
      .subscribe(res => {
        if (res) {
          const replacementIndex = this.repuestos.findIndex(
            (res) => res.idRepuesto === idRepuesto);
          this.repuestos.splice(replacementIndex, 1);
          this.clearInput();
        }
        this.loading = false;
      });
  }

  private clearInput(){
    this.filter = "";
  }
}
