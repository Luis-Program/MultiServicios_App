import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EquipoActivoInactivo, EquipoCliente, EquipoClienteServicios, EquipoMaxMinCliente, UpdateEquipoDTO } from 'src/app/models/equipo.model';
import { EquipoService } from 'src/app/services/equipo.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  protected cantidadServiciosFinPen: EquipoClienteServicios | null = null;
  protected cantidadActivoInactivo: EquipoActivoInactivo[] = [];
  protected equiposMaxMin: EquipoMaxMinCliente | null = null;
  protected equipo: EquipoCliente | null = null;
  protected equipos: EquipoCliente[] = [];
  private idPersona: string | null = null;
  protected loadingGraphic1 = false; // Carga de graficos servicios pendientes y finalizados
  protected loadingGraphic2 = false; // Carga de graficos cantidad de servicios activos e inactivos
  protected loadingGraphic3 = false; // Carga de graficos de los equipos con menor y mayor cantidad de servicios
  protected loadingMain = false; // Carga principal
  protected filter = "";

  constructor(
    private equipoService: EquipoService,
  ) { }

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    if (this.idPersona) {
      this.getAllEquipment(this.idPersona);
      this.getServiceAmount(this.idPersona);
      this.getEquipmentActiveInactive(this.idPersona);
      this.getEquipmentMinMax(this.idPersona);
    }
  }

  private getAllEquipment(idPersona: string) {
    this.loadingMain = true;
    this.equipoService.getAllByIdPersona(idPersona)
      .subscribe(equipments => {
        this.equipos = equipments;
        this.loadingMain = false;
      });
  }

  private getServiceAmount(idPersona: string) {
    this.loadingGraphic1 = true;
    this.equipoService.getServiceAmountClient(idPersona)
      .subscribe(data => {
        this.cantidadServiciosFinPen = data;
        this.loadingGraphic1 = false;
      });
  }

  private getEquipmentActiveInactive(idPersona: string) {
    this.loadingGraphic2 = true;
    this.equipoService.getEquipmentsActiveInactiveClient(idPersona)
      .subscribe(data => {
        this.cantidadActivoInactivo = data;
        this.loadingGraphic2 = false;
      });
  }

  private getEquipmentMinMax(idPersona: string) {
    this.loadingGraphic3 = true;
    this.equipoService.getEquipmentMaxMinClient(idPersona)
      .subscribe(data => {
        this.equiposMaxMin = data;
        this.loadingGraphic3 = false;
      });
  }

  protected updateEquipmentManager(idEquipo: number, dto: UpdateEquipoDTO) {
    this.loadingMain = true;
    this.equipoService.updateClient(idEquipo, dto)
      .subscribe(res => {
        if (res) {
          const equipmentIndex = this.equipos.findIndex(
            (res) => res.idEquipo === idEquipo);
          this.equipos[equipmentIndex] = res;
          this.clearInput();
        }
        this.loadingMain = false;
      });
  }

  private clearInput(){
    this.filter = "";
  }
}
