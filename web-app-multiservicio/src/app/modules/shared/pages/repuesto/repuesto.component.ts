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

  protected repuesto: RepuestoRelaciones | null = null;
  protected repuestos: RepuestoRelaciones[] = [];
  protected tipoRepuestos: TipoRepuesto[] = [];
  protected rol: string | null = null;
  protected idRepuesto: number | null = null;
  protected loading = false;

  constructor(
    private tipoRepuestoService: TipoRepuestoService,
    private repuestoService: RepuestoService
  ) { }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    this.idRepuesto = Number(localStorage.getItem('idNoti'));
    localStorage.removeItem('idNoti');
    this.loadDataByRol();
  }

  private loadDataByRol() {
    if (this.rol) {
      if (this.rol === 'Gerente General') {
        this.getAllReplacementWithRelations();
        if (this.idRepuesto) {
          this.getOneReplacement(this.idRepuesto);
          // Obtencion por notificacion

        }
        // this.loadDataManager();
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
    this.repuesto = this.repuestos.find(replacement => replacement.idRepuesto = idRepuesto) as RepuestoRelaciones;
    if (this.repuesto) {
      // show content
    }
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
          // Success
          this.repuestos.push(replacement);
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
          // Success
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
          // Success
        }
        this.loading = false;
      });
  }

  private loadDataManager() {
    this.repuestos.push({
      idRepuesto: 1,
      nombre: 'repuesto1',
      cantidadDisponible: 50,
      limiteInferior: 10,
      Tipo_Repuesto: {
        idTipoRepuesto: 1,
        tipo: 'Tipo Repuesto 1'
      }
    },
      {
        idRepuesto: 2,
        nombre: 'repuesto2',
        cantidadDisponible: 75,
        limiteInferior: 5,
        Tipo_Repuesto: {
          idTipoRepuesto: 4,
          tipo: 'Tipo Repuesto 4'
        }
      },
      {
        idRepuesto: 8,
        nombre: 'repuesto8',
        cantidadDisponible: 88,
        limiteInferior: 10,
        Tipo_Repuesto: null
      },
      {
        idRepuesto: 3,
        nombre: 'repuesto3',
        cantidadDisponible: 90,
        limiteInferior: 50,
        Tipo_Repuesto: {
          idTipoRepuesto: 3,
          tipo: 'Tipo Repuesto 3'
        }
      },
      {
        idRepuesto: 4,
        nombre: 'repuesto4',
        cantidadDisponible: 65,
        limiteInferior: 25,
        Tipo_Repuesto: {
          idTipoRepuesto: 2,
          tipo: 'Tipo Repuesto 2'
        }
      },
      {
        idRepuesto: 9,
        nombre: 'repuesto9',
        cantidadDisponible: 50,
        limiteInferior: 15,
        Tipo_Repuesto: null
      }
    );

    this.tipoRepuestos.push({
      idTipoRepuesto: 1,
      tipo: 'Tipo Repuesto 1'
    },
      {
        idTipoRepuesto: 2,
        tipo: 'Tipo Repuesto 2'
      },
      {
        idTipoRepuesto: 2,
        tipo: 'Tipo Repuesto 2'
      },
      {
        idTipoRepuesto: 3,
        tipo: 'Tipo Repuesto 3'
      },
      {
        idTipoRepuesto: 4,
        tipo: 'Tipo Repuesto 4'
      });
  }

}
