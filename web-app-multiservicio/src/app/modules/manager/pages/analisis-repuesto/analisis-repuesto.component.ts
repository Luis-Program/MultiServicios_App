import { Component, OnInit } from '@angular/core';
import { Analisis_Repuesto, Graphics } from 'src/app/models/analisis_repuesto.model';
import { AnalisisRepuestoService } from 'src/app/services/analisis-repuesto.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-analisis-repuesto',
  templateUrl: './analisis-repuesto.component.html',
  styleUrls: ['./analisis-repuesto.component.css'],
  providers: [DatePipe]
})
export class AnalisisRepuestoComponent implements OnInit {

  protected analisisRepuestos: Analisis_Repuesto[] = [];
  protected dataGraphic: Graphics[] = [];
  protected loadingGraphic = false; // Carga del grafico
  protected loading = false; // Carga principal
  protected filter = "";

  public chartData      !: any[];
  public gradient       : boolean = true;
  public showLabels     : boolean = true;
  public isDoughnut     : boolean = false;
  public colorScheme    : string  = 'nightLights';

  constructor(
    private analisisRepuestoService: AnalisisRepuestoService,
    public datepipe: DatePipe
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

  protected getDataGraphic(nombreRepuesto: string){
    this.loading = true;
    this.analisisRepuestoService.getDataGraphics(nombreRepuesto)
    .subscribe((data: Graphics[]) => {
      
      this.chartData = data.map(d => {
        return {
          value : d.amount,
          name  : this.datepipe.transform(d.timedate, 'yyyy/MM/dd HH:mm')
        }
      })      

      this.clearInput();
      this.loading = false;
    });
  }

  private clearInput() {
    this.filter = "";
  }

  openModal(analisis: Analisis_Repuesto) {
    this.getDataGraphic(analisis.nombreRepuesto)
  }
}
