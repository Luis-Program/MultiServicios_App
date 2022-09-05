import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DireccionDropDown } from 'src/app/models/direccion.model';
import { EquipoRelacionesAnidadas, EquipoActivoInactivo, UnEquipoServicios, CreateEquipoDTO, UpdateEquipoDTO } from 'src/app/models/equipo.model';
import { PersonaDropdown, TrabajadoresMinMaxServicios } from 'src/app/models/persona.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  protected list = [{ estado: "Activo", value: true }, { estado: "Inactivo", value: false }];
  protected clientesEquiposMinMax: TrabajadoresMinMaxServicios[] = [];
  protected equipoActivosInactivos: EquipoActivoInactivo[] = [];
  protected unEquipoServicio: UnEquipoServicios | null = null;
  protected equipos: EquipoRelacionesAnidadas[] = [];
  protected direcciones: DireccionDropDown[] = [];
  protected clientes: PersonaDropdown[] = [];
  protected idEquipo: number | null = null;
  protected graphicEquipmentData = false;
  protected loading = false;
  protected create = false;
  protected filter = "";

  //MODAL
  protected equipmentForm!: FormGroup;
  protected newEquipment!: Boolean;
  protected idEquipment!: number;

  // CHARTS
  protected activesCharts  !: any[];
  protected minMaxChart    !: any[];
  protected equipoChart    !: any[];

  protected gradient: boolean = true;
  protected showLabels: boolean = true;
  protected isDoughnut: boolean = false;
  protected colorScheme: string = 'ocean';
  // cool ocean nightLights

  // BAR CHART
  protected showXAxis = true;
  protected showYAxis = true;
  protected showXAxisLabel = true;
  protected xAxisLabel = 'Cliente';
  protected showYAxisLabel = true;
  protected yAxisLabel = 'Equipos';

  protected showLegend = true;
  protected legendTitle = 'Equipos';

  constructor(
    private direccionService: DireccionService,
    private personaService: PersonaService,
    private equipoService: EquipoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('idNoti');
    this.idEquipo = Number(id);
    localStorage.removeItem('idNoti');
    this.getAllEquipmentWithRelations();
    this.getAllClients();
    this.getEquipmentActiveInactive();
    this.getClientAmountMinMAx();
    this.initForm();
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
    this.personaService.getClientsWithAmountEquipsMinMax()
      .subscribe((data) => {
        this.clientesEquiposMinMax = data;

        this.minMaxChart = data.map(m => {
          return {
            name: `${m.nombre} ${m.apellidos}`,
            value: m.cantidad
          }
        })
      });
  }

  /**
   * Trae toda la información para editar y crear
   */
  protected getDataForCreateUpdate() {
    this.getAllClients();
  }

  /**
   * Peronas Clientes
   */
  private getAllClients() {
    this.personaService.getAllCients()
      .subscribe(clients => {
        this.clientes = clients;
        this.getAllDireccions();
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
    this.equipoService.getEquipmentsActiveInactive()
      .subscribe((data: EquipoActivoInactivo[]) => {
        this.equipoActivosInactivos = data;
        this.activesCharts = data.map(a => {
          return {
            name: this.getNameService(a.estado),
            value: a.cantidad
          }
        })
      });
  }

  protected getNameService(state: boolean): string {
    return (state) ? 'Activos' : 'Inactivos';
  }

  protected getOneEquipment(idEquipo: number) {
    this.equipoService.getOne(idEquipo)
      .subscribe(equimpent => {
        if (equimpent.nombre && equimpent.modelo) {
          this.filter = equimpent.nombre;
        }
      })
  }

  private getOneEquipmentServices(idEquipo: number) {
    this.equipoService.getOneEquipmentsServices(idEquipo)
      .subscribe((data: UnEquipoServicios) => {
        if (data.completada || data.pendiente) {
          this.equipoChart = [
            {
              name: 'Completados',
              value: data.completada
            },
            {
              name: 'Pendientes',
              value: data.pendiente
            }
          ];
        } else {
          this.graphicEquipmentData = false;
        }
      });
  }

  protected createEquipment(dto: CreateEquipoDTO) {
    this.equipoService.create(dto)
      .subscribe(equipment => {
        if (equipment) {
          this.equipos.push(equipment);
          Swal.fire({
            title: 'Creado',
            text: 'Equipo creado',
            icon: 'success'
          });
          this.clearInput();
          this.getClientAmountMinMAx();
        }
      });
  }

  protected updateEquipmentManager(idEquipo: number, dto: UpdateEquipoDTO) {
    this.equipoService.updateManager(idEquipo, dto)
      .subscribe(res => {
        if (res) {
          const equipmentIndex = this.equipos.findIndex(
            (res) => res.idEquipo === idEquipo);
          this.equipos[equipmentIndex] = res;
          Swal.fire({
            title: "Actualizado",
            text: "Equipo actualizado",
            icon: 'success'
          });
          this.clearInput();
          this.getClientAmountMinMAx();
        }
      });
  }

  protected deleteEquipment(idEquipo: number) {
    this.equipoService.delete(idEquipo)
      .subscribe(res => {
        if (res) {
          const equipmentIndex = this.equipos.findIndex(
            (equipment) => equipment.idEquipo === idEquipo);
          this.equipos.splice(equipmentIndex, 1);
          Swal.fire({
            title: 'Eliminado',
            text: 'Equipo eliminado',
            icon: 'success'
          });
          this.getClientAmountMinMAx();
          this.clearInput();
        }
      });
  }

  protected openModalByEquipment(equipment?: EquipoRelacionesAnidadas | null, create?: boolean) {
    this.initForm();
    this.create = create ? true : false;
    if (equipment) {
      this.newEquipment = false;
      this.getOneEquipmentServices(equipment.idEquipo);
      return this.setEquipment(equipment);
    }
  }

  private initForm() {
    this.newEquipment = true;
    this.equipmentForm = this.formBuilder.group({
      idEquipo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      modelo: ['', [Validators.required, Validators.maxLength(20)]],
      estado: true,
      fechaUltimoServicio: ['', [Validators.required]],
      periodoDeServicio: ['', [Validators.required]],
      preventivoActivo: false,
      idDireccion: ['', [Validators.required]],
      idPersona: ['', [Validators.required]],
    });
  }

  protected get nombre() {
    return this.equipmentForm.get('nombre');
  }

  protected get modelo() {
    return this.equipmentForm.get('modelo');
  }

  protected get fechaUltimoServicio() {
    return this.equipmentForm.get('fechaUltimoServicio');
  }

  protected get periodoDeServicio() {
    return this.equipmentForm.get('periodoDeServicio');
  }

  protected get idDireccion() {
    return this.equipmentForm.get('idDireccion');
  }

  protected get idPersona() {
    return this.equipmentForm.get('idPersona');
  }

  private setEquipment(equipment: EquipoRelacionesAnidadas) {
    let idPersona, idDireccion!: number;
    idPersona = (equipment.Persona.idPersona) ? equipment.Persona.idPersona : 0;
    idDireccion = (equipment.Direccion?.idDireccion) ? equipment.Direccion?.idDireccion : 0;
    this.equipmentForm.setValue({
      idEquipo: equipment.idEquipo,
      nombre: equipment.nombre,
      modelo: equipment.modelo,
      estado: equipment.estado,
      fechaUltimoServicio: equipment.fechaUltimoServicio,
      periodoDeServicio: equipment.periodoDeServicio,
      preventivoActivo: equipment.preventivoActivo,
      idDireccion: idDireccion,
      idPersona: idPersona,
    });
    this.equipmentForm.addControl('nombre', this.formBuilder.control(this.equipmentForm.value.nombre, []));
    this.equipmentForm.addControl('modelo', this.formBuilder.control(this.equipmentForm.value.modelo, []));
    this.equipmentForm.addControl('estado', this.formBuilder.control(this.equipmentForm.value.estado, []));
    this.equipmentForm.addControl('periodoDeServicio', this.formBuilder.control(this.equipmentForm.value.periodoDeServicio, []));
    this.equipmentForm.addControl('fechaUltimoServicio', this.formBuilder.control(formatDate(this.equipmentForm.value.fechaUltimoServicio!, 'dd-MM-yyyy HH:mm:ss', 'en'), []));
    this.equipmentForm.addControl('idDireccion', this.formBuilder.control(idDireccion, []));
    this.equipmentForm.addControl('idPersona', this.formBuilder.control(idPersona, []));
    this.idEquipment = equipment.idEquipo;
  }

  protected createEquipmentForm() {
    if (this.equipmentForm.invalid) return Object.values(this.equipmentForm.controls).forEach(c => c.markAsTouched());
    if (!this.equipmentForm.touched) return;
    const { idEquipo, ...rest } = this.equipmentForm.value;
    if (idEquipo) {
        this.updateEquipmentManager(idEquipo, rest);
      }
      return this.createEquipment(rest);
  }

  protected deleteEquipmentModal() {
    Swal.fire({
      title: '¡Atención!',
      text: '¿Está seguro de eliminar el servicio?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.deleteEquipment(this.idEquipment);
      }
    });
  }

  private clearInput() {
    this.filter = "";
  }
}
