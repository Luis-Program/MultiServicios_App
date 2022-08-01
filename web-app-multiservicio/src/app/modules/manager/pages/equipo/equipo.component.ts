import { Component, OnInit } from '@angular/core';
import { DireccionRelacionesAnidadas } from 'src/app/models/direccion.model';
import { EquipoRelacionesAnidadas, EquipoActivoInactivo, UnEquipoServicios, CreateEquipoDTO, UpdateEquipoDTO } from 'src/app/models/equipo.model';
import { Clientes, Persona } from 'src/app/models/persona.model';
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
  protected direcciones: DireccionRelacionesAnidadas[] = [];
  protected equipo: EquipoRelacionesAnidadas | null = null;
  protected equipos: EquipoRelacionesAnidadas[] = [];
  protected clientesEquiposMinMax: Clientes[] = [];
  protected idEquipo: number | null = null;
  protected clientes: Persona[] = [];
  protected loading = false;

  constructor(
    private equipoService: EquipoService,
    private personaService: PersonaService,
    private direccionService: DireccionService
  ) { }

  ngOnInit(): void {
    this.idEquipo = Number(localStorage.getItem('idNoti'));
    localStorage.removeItem('idNoti');
    this.getAllEquipmentWithRelations();
    this.getEquipmentActiveInactive();
    this.getClientAmountMinMAx();
    // this.loadDataManager();
    if (this.idEquipo) {
      this.getOneEquipment(this.idEquipo);
      // Obtencion del equipo por notificación

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
    this.loading = true;
    this.personaService.getClientsWithAmountEquipsMinMax()
      .subscribe(clients => {
        this.clientesEquiposMinMax = clients;
        this.getAllDireccions();
        this.loading = false;
      });
  }

  /**
   * Trae toda la información para editar y crear
   */
  protected getDataForCreateDelete(){
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
    this.direccionService.getAllWithRelations()
      .subscribe(directions => {
        this.direcciones = directions;
      });
  }

  /**
   * Obtención de cantidad de equipos inactivos y activos
   */
  private getEquipmentActiveInactive() {
    this.equipoService.getEquipmentsActiveInactive()
      .subscribe(data => {
        this.equipoActivosInactivos = data;
      });
  }

  protected getOneEquipment(idEquipo: number) {
    this.equipo = this.equipos.find(equipment => equipment.idEquipo = idEquipo) as EquipoRelacionesAnidadas;
    if (this.equipo) {
      this.loading = true;
      this.getOneEquipmentServices(idEquipo);
      // show content
    }
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
        this.loading = false;
      });
  }

  protected createEquipment(dto: CreateEquipoDTO) {
    this.loading = true;
    this.equipoService.create(dto)
      .subscribe(equipment => {
        if (equipment) {
          // Success
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
          // Success
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
          // Success
        }
        this.loading = false;
      });
  }
}
