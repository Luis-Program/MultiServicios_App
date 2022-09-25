import { Component, OnInit } from '@angular/core';
import { Analisis_Repuesto, Graphics } from 'src/app/models/analisis_repuesto.model';
import { AnalisisRepuestoService } from 'src/app/services/analisis-repuesto.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-analisis-repuesto',
  templateUrl: './analisis-repuesto.component.html',
  styleUrls: ['./analisis-repuesto.component.css'],
  providers: [DatePipe]
})
export class AnalisisRepuestoComponent implements OnInit {

  protected analisisRepuestos: Analisis_Repuesto[] = [];
  protected analisisRepuesto!: Analisis_Repuesto;
  protected dataGraphic: Graphics[] = [];
  protected loadingGraphic = false; // Carga del grafico
  public loading !: boolean; // Carga principal
  protected filter = "";

  public chartData      !: any[];
  public gradient       : boolean = true;
  public showLabels     : boolean = true;
  public isDoughnut     : boolean = false;
  public colorScheme    : string  = 'ocean';

  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Fecha';
  // yAxisLabel: string = 'Population';
  timeline: boolean = true;

  constructor(
    private analisisRepuestoService: AnalisisRepuestoService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getAllReplacementAnalysis();
  }

  private getAllReplacementAnalysis(){
    this.analisisRepuestoService.getAll()
    .subscribe(replacementsAnalysis => {
      this.analisisRepuestos = replacementsAnalysis;
      this.loading = false;
    });
  }

  protected downloadReport(){
    let array: any = [
      ["id","Repuesto","Tipo","Cantidad previa","Cantidad despues","Diferencias","Fecha Hora","Acción"],
    ];
    for (let index = 0; index < this.analisisRepuestos.length; index++) {
      let alter: any = [
        this.analisisRepuestos[index].idAnalisisRepuesto,
        this.analisisRepuestos[index].nombreRepuesto,
        this.analisisRepuestos[index].nombreTipo,
        String(this.analisisRepuestos[index].cantidadAntes),
        String(this.analisisRepuestos[index].cantidadDespues),
        String(this.analisisRepuestos[index].diferenciaCantidades),
        String(this.parseDate(this.analisisRepuestos[index].fechaHora)),
        this.analisisRepuestos[index].tipoAccion,
      ]
      array.push(alter);
    }

    let CsvString = "";
    array.forEach((RowItem:any) => {
      RowItem.forEach((colItem:any) => {
        CsvString += colItem + ',';
      });
      CsvString += '\r\n';
    })
    CsvString = "data:applications/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(CsvString);
    let x = document.createElement("A");
    x.setAttribute("href", CsvString);
    x.setAttribute("download","analisis-repuesto.csv")
    document.body.appendChild(x);
    x.click();
  }

  private parseDate(date :Date){
    return formatDate(date,'medium','es').replace(",",'');
  }

  protected getDataGraphic(nombreRepuesto: string){
    this.analisisRepuestoService.getDataGraphics(nombreRepuesto)
    .subscribe((data: Graphics[]) => {

      this.chartData = [
        {
          name: nombreRepuesto,
          series: data.map(d =>{
            return {
              name: this.datepipe.transform(d.timedate),
              value: d.amount
            }
          })
        }
      ]
      this.clearInput();
    });
  }

  private clearInput() {
    this.filter = "";
  }

  openModal(analisis: Analisis_Repuesto) {
    this.analisisRepuesto = analisis;
    this.getDataGraphic(analisis.nombreRepuesto)
  }
}
