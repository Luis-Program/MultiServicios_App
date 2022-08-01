import { Component, OnInit } from '@angular/core';
import { Analisis_Repuesto } from 'src/app/models/analisis_repuesto.model';
import { AnalisisRepuestoService } from 'src/app/services/analisis-repuesto.service';

@Component({
  selector: 'app-analisis-repuesto',
  templateUrl: './analisis-repuesto.component.html',
  styleUrls: ['./analisis-repuesto.component.css']
})
export class AnalisisRepuestoComponent implements OnInit {

  protected analisisRepuesto: Analisis_Repuesto | null = null;
  protected analisisRepuestos: Analisis_Repuesto[] = [];
  protected loading = false;

  constructor(
    private analisisRepuestoService: AnalisisRepuestoService
  ) { }

  ngOnInit(): void {
    this.getAllReplacementAnalysis();
    // this.loadData();
  }

  private getAllReplacementAnalysis(){
    this.loading = true;
    this.analisisRepuestoService.getAll()
    .subscribe(replacementsAnalysis => {
      this.analisisRepuestos = replacementsAnalysis;
      this.loading = false;
    });
  }

  protected getOneReplacementAnalysis(idAnalisisRepuesto: number){
    this.analisisRepuesto = this.analisisRepuestos.find(replacementAnalysis => replacementAnalysis.idAnalisisRepuesto = idAnalisisRepuesto) as Analisis_Repuesto;
    if (this.analisisRepuesto) {
      // show content
    }
  }

  private loadData(){
    this.analisisRepuestos.push({
      idAnalisisRepuesto: 1,
      nombreRepuesto: 'repuesto1',
      nombreTipo: 'tipo1',
      cantidadAntes: 10,
      cantidadDespues: 8,
      diferenciaCantidades: -2,
      fechaHora: new Date("2022-01-10"),
      tipoAccion: 'sustracción'
    },
    {
      idAnalisisRepuesto: 2,
      nombreRepuesto: 'repuesto2',
      nombreTipo: 'tipo2',
      cantidadAntes: 0,
      cantidadDespues: 22,
      diferenciaCantidades: 22,
      fechaHora: new Date("2022-05-01"),
      tipoAccion: 'adición'
    },
    {
      idAnalisisRepuesto: 3,
      nombreRepuesto: 'repuesto3',
      nombreTipo: 'tipo3',
      cantidadAntes: 4,
      cantidadDespues: 1,
      diferenciaCantidades: -3,
      fechaHora: new Date("2021-08-22"),
      tipoAccion: 'sustracción'
    },
    {
      idAnalisisRepuesto: 4,
      nombreRepuesto: 'repuesto4',
      nombreTipo: 'tipo4',
      cantidadAntes: 89,
      cantidadDespues: 90,
      diferenciaCantidades: 1,
      fechaHora: new Date("2022-01-10"),
      tipoAccion: 'adición'
    });

  }
}
