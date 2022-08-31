import { Component, OnInit } from '@angular/core';
import { DireccionDropDown } from 'src/app/models/direccion.model';
import { EquipoRelacionesAnidadas, EquipoActivoInactivo, UnEquipoServicios, CreateEquipoDTO, UpdateEquipoDTO } from 'src/app/models/equipo.model';
import { PersonaDropdown, TrabajadoresMinMaxServicios } from 'src/app/models/persona.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  protected equipoActivosInactivos: EquipoActivoInactivo[] = [];
  protected unEquipoServicio: UnEquipoServicios | null = null;
  protected direcciones: DireccionDropDown[] = [];
  protected equipos: EquipoRelacionesAnidadas[] = [];
  protected clientesEquiposMinMax: TrabajadoresMinMaxServicios[] = [];
  protected idEquipo: number | null = null;
  protected clientes: PersonaDropdown[] = [];
  protected loadingGraphicEquipmentsInacAct = false; // Carga grafica de equipos inactivo y activos
  protected loadingGraphicOneEquipment = false;  // Carga grafica cuando se selecciona un equipo y mustra sus servicios
  protected loadingGraphicClient = false; // Carga de grafica con menor y mayor cantidad de equipos
  protected loading = false; // Carga principal
  protected filter = "";

  // CHARTS
  public activesCharts  !: any[];
  public minMaxChart    !: any[];
  public gradient       : boolean = true;
  public showLabels     : boolean = true;
  public isDoughnut     : boolean = false;
  public colorScheme    : string = 'vivid';

  // BAR CHART
  public showXAxis      = true;
  public showYAxis      = true;
  public showXAxisLabel = true;
  public xAxisLabel     = 'Cliente';
  public showYAxisLabel = true;
  public yAxisLabel     = 'Equipos';

  constructor(
    private equipoService: EquipoService,
    private personaService: PersonaService,
    private direccionService: DireccionService
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('idNoti');
    this.idEquipo = Number(id);
    localStorage.removeItem('idNoti');
    this.getAllEquipmentWithRelations();
    this.getAllDireccions();
    this.getEquipmentActiveInactive();
    this.getClientAmountMinMAx();
    if (this.idEquipo) {
      this.getOneEquipment(this.idEquipo);
    }
  }

  /**
   * Traer equipos
   */
  private getAllEquipmentWithRelations() {
    this.loading = true;
    this.equipoService.getAllEquipments()
      .subscribe(equipment => {
        this.equipos = equipment;
        this.loading = false;
      });
  }

  /**
   * Traer clientes con cantidad de equipos solo el máximo y minimo de equipos
   */
  private getClientAmountMinMAx() {
    this.loadingGraphicClient = true;
    this.personaService.getClientsWithAmountEquipsMinMax()
      .subscribe((clients: TrabajadoresMinMaxServicios[]) => {
        this.clientesEquiposMinMax = clients;

        this.minMaxChart = clients.map(m => {
          return {
            name  : `${m.nombre} ${m.apellidos}`,
            value : m.cantidad
          }
        })

        console.log(this.minMaxChart);


        this.loadingGraphicClient = false;
      });
  }

  /**
   * Trae toda la información para editar y crear
   */
  protected getDataForCreateUpdate(){
    this.getAllClients();
  }

  /**
   * Peronas Clientes
   */
  private getAllClients() {
    this.loading = true;
    this.personaService.getAllCients()
      .subscribe(clients => {
        this.clientes = clients;
        this.getAllDireccions();
        this.loading = false;
      });
  }

  /**
   * Direcciones
   */
  private getAllDireccions() {
    this.direccionService.getAllDropDown()
      .subscribe(directions => {
        this.direcciones = directions;
      });
  }

  /**
   * Obtención de cantidad de equipos inactivos y activos
   */
  private getEquipmentActiveInactive() {
    this.loadingGraphicEquipmentsInacAct = false;
    this.equipoService.getEquipmentsActiveInactive()
      .subscribe(data => {
        this.equipoActivosInactivos = data;

        // console.log(data);


        this.loadingGraphicEquipmentsInacAct = true;
      });
  }

  protected getOneEquipment(idEquipo: number) {
    this.equipoService.getOne(idEquipo)
    .subscribe(equimpent => {
      if (equimpent.nombre && equimpent.modelo) {
        this.filter = equimpent.nombre;
      }
    })
  }

  /**
   *
   * @param idEquipo
   * Trae los servicios completos y pendientes de ese equipo
   */
  private getOneEquipmentServices(idEquipo: number) {
    this.equipoService.getOneEquipmentsServices(idEquipo)
      .subscribe(data => {
        this.unEquipoServicio = data;
        this.loadingGraphicOneEquipment = false;
      });
  }

  protected createEquipment(dto: CreateEquipoDTO) {
    this.loading = true;
    this.equipoService.create(dto)
      .subscribe(equipment => {
        if (equipment) {
          this.clearInput();
          this.equipos.push(equipment);
        }
        this.loading = false;
      });
  }

  protected updateEquipmentManager(idEquipo: number, dto: UpdateEquipoDTO) {
    this.loading = true;
    this.equipoService.updateManager(idEquipo, dto)
      .subscribe(res => {
        if (res) {
          const equipmentIndex = this.equipos.findIndex(
            (res) => res.idEquipo === idEquipo);
          this.equipos[equipmentIndex] = res;
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected deleteEquipment(idEquipo: number) {
    this.loading = true;
    this.equipoService.delete(idEquipo)
      .subscribe(res => {
        if (res) {
          const equipmentIndex = this.equipos.findIndex(
            (equipment) => equipment.idEquipo === idEquipo);
          this.equipos.splice(equipmentIndex, 1);
          this.clearInput();
        }
        this.loading = false;
      });
  }

  private clearInput(){
    this.filter = "";
  }
}
