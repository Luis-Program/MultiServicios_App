import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EquipoActivoInactivo, EquipoCliente, EquipoClienteServicios, EquipoMaxMinCliente, UpdateEquipoDTO } from 'src/app/models/equipo.model';
import { EquipoService } from 'src/app/services/equipo.service';
import Swal from 'sweetalert2';

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
  protected list = [{estado: "Activo",value: true},{estado: "Inactivo", value: false}]
  protected equipos: EquipoCliente[] = [];
  private idPersona: string | null = null;
  protected loadingGraphic1 = false; // Carga de graficos servicios pendientes y finalizados
  protected loadingGraphic2 = false; // Carga de graficos cantidad de servicios activos e inactivos
  protected loadingGraphic3 = false; // Carga de graficos de los equipos con menor y mayor cantidad de servicios
  protected loadingMain = false; // Carga principal
  protected filter = "";

    //MODAL
    protected equipmentForm!: FormGroup;
    protected newEquipment!: Boolean;
    protected idEquipment!: number;

  constructor(
    private equipoService: EquipoService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    if (this.idPersona) {
      this.getAllEquipment(this.idPersona);
      this.getServiceAmount(this.idPersona);
      this.getEquipmentActiveInactive(this.idPersona);
      this.getEquipmentMinMax(this.idPersona);
      this.initForm();
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
          Swal.fire({
            title: "Actualizado",
            text: "Equipo actualizado",
            icon: 'success'
          });
          this.clearInput();
        }
        this.loadingMain = false;
      });
  }

  protected openModalByEquipment(equipment?: EquipoCliente) {
    this.initForm();
    if (equipment) {
      this.equipo = equipment;
      this.newEquipment = false;
      return this.setEquipment(equipment);
    }
  }

  private initForm() {
    this.newEquipment = true;
    this.equipmentForm = this.formBuilder.group({
      idEquipo: [''],
      estado: ['']
    });
  }

  private setEquipment(equipment: EquipoCliente) {
    this.equipmentForm.setValue({
      idEquipo: equipment.idEquipo,
      estado :  equipment.estado
    });
    this.equipmentForm.addControl('estado', this.formBuilder.control(this.equipmentForm.value.estado, []));
    this.idEquipment = equipment.idEquipo;
  }

  protected editEquipmentForm() {
    if (this.equipmentForm.invalid) return Object.values(this.equipmentForm.controls).forEach(c => c.markAsTouched());
    if (!this.equipmentForm.touched) return;
    const { idEquipo, ...rest } = this.equipmentForm.value;
    if (idEquipo) {
      if (!this.equipo?.estado) {
        this.updateEquipmentManager(idEquipo, rest);
      } else {
        Swal.fire({
          title: '¡Atención!',
          text: '¿Está seguro de desactivar el equipo?',
          icon: 'warning',
          showConfirmButton: true,
          showCancelButton: true
        }).then((res: any) => {
          if (res.isConfirmed) {
          this.updateEquipmentManager(idEquipo, rest);
          }
        });
      }
    }
  }

  protected get department(){
    if (this.equipo && this.equipo.Direccion?.Municipio?.Departamento?.Pais) {
      return this.equipo.Direccion?.Municipio?.Departamento?.Pais?.nombre + " " + this.equipo.Direccion?.Municipio?.Departamento?.nombre
    }
    return "No ingresado"
  }

  protected get direction(){
    if (this.equipo && this.equipo.Direccion?.Municipio) {
      return this.equipo.Direccion?.Municipio.nombre+ " " + this.equipo.Direccion.direccion
    }
    return "No ingresado"
  }

  private clearInput(){
    this.filter = "";
  }
}
