import { Component, OnInit } from '@angular/core';
import { Analisis_Repuesto, Graphics } from 'src/app/models/analisis_repuesto.model';
import { AnalisisRepuestoService } from 'src/app/services/analisis-repuesto.service';

@Component({
  selector: 'app-analisis-repuesto',
  templateUrl: './analisis-repuesto.component.html',
  styleUrls: ['./analisis-repuesto.component.css']
})
export class AnalisisRepuestoComponent implements OnInit {

  protected analisisRepuestos: Analisis_Repuesto[] = [];
  protected dataGraphic: Graphics[] = [];
  protected loadingGraphic = false; // Carga del grafico
  protected loading = false; // Carga principal
  protected filter = "";

  constructor(
    private analisisRepuestoService: AnalisisRepuestoService
  ) { }

  ngOnInit(): void {
    this.getAllReplacementAnalysis();
  }

  private getAllReplacementAnalysis(){
    this.loading = true;
    this.analisisRepuestoService.getAll()
    .subscribe(replacementsAnalysis => {
      this.analisisRepuestos = replacementsAnalysis;
      this.loading = false;
    });
  }

  private clearInput() {
    this.filter = "";
  }
}
