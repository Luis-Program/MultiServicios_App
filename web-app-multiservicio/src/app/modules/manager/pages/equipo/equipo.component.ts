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

  protected clientesEquiposMinMax: TrabajadoresMinMaxServicios[] = [];
  protected equipoActivosInactivos: EquipoActivoInactivo[] = [];
  protected unEquipoServicio: UnEquipoServicios | null = null;
  protected equipos: EquipoRelacionesAnidadas[] = [];
  protected loadingGraphicEquipmentsInacAct = false; // Carga grafica de equipos inactivo y activos
  protected direcciones: DireccionDropDown[] = [];
  protected loadingGraphicOneEquipment = false;  // Carga grafica cuando se selecciona un equipo y mustra sus servicios
  protected clientes: PersonaDropdown[] = [];
  protected idEquipo: number | null = null;
  protected loadingGraphicClient = false; // Carga de grafica con menor y mayor cantidad de equipos
  protected loading = false; // Carga principal
  protected filter = "";

  //MODAL
  protected equipmentForm!: FormGroup;
  protected newEquipment!: Boolean;
  protected idEquipment!: number;

  // CHARTS
  public activesCharts  !: any[];
  public minMaxChart    !: any[];
  public gradient: boolean = true;
  public showLabels: boolean = true;
  public isDoughnut: boolean = false;
  public colorScheme: string = 'vivid';

  // BAR CHART
  public showXAxis = true;
  public showYAxis = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Cliente';
  public showYAxisLabel = true;
  public yAxisLabel = 'Equipos';

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
    this.loadingGraphicClient = true;
    this.personaService.getClientsWithAmountEquipsMinMax()
      .subscribe((data) => {
        this.clientesEquiposMinMax = data;

        this.minMaxChart = data.map(m => {
          return {
            name: `${m.nombre} ${m.apellidos}`,
            value: m.cantidad
          }
        })

        // console.log(data);


        this.loadingGraphicClient = false;
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
          this.equipos.push(equipment);
          Swal.fire({
            title: 'Creado',
            text: 'Equipo creado',
            icon: 'success'
          });
          this.clearInput();
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
          Swal.fire({
            title: "Actualizado",
            text: "Equipo actualizado",
            icon: 'success'
          });
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
          Swal.fire({
            title: 'Eliminado',
            text: 'Equipo eliminado',
            icon: 'success'
          });
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected openModalByEquipment(equipment?: EquipoRelacionesAnidadas) {
    this.initForm();
    if (equipment) {
      this.newEquipment = false;
      return this.setEquipment(equipment);
    }
  }

  private initForm() {
    this.newEquipment = true;
    this.equipmentForm = this.formBuilder.group({
      idEquipo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      modelo: ['', [Validators.required, Validators.maxLength(100)]],
      estado: true,
      fechaUltimoServicio: ['', [Validators.required]],
      periodoDeServicio: ['', [Validators.required]],
      preventivoActivo: false,
      idDireccion: ['', [Validators.required]],
      idPersona: ['', [Validators.required]],
    });
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
      return this.updateEquipmentManager(idEquipo, rest);
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
