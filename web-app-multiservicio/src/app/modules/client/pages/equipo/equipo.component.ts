import { formatDate } from '@angular/common';
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

  protected list = [{ estado: "Activo", value: true }, { estado: "Inactivo", value: false }];
  protected cantidadServiciosFinPen: EquipoClienteServicios | null = null;
  protected cantidadActivoInactivo: EquipoActivoInactivo[] = [];
  protected equiposMaxMin: EquipoMaxMinCliente | null = null;
  protected equipo: EquipoCliente | null = null;
  protected equipos: EquipoCliente[] = [];
  private idPersona: string | null = null;
  protected loading = false;
  protected filter = "";

  //MODAL
  protected equipmentForm!: FormGroup;
  protected newEquipment!: Boolean;
  protected idEquipment!: number;

  // CHARTS
  protected chartMinMax  !: any[];
  protected activeInactiveChart !: any[];
  protected endStartedServicesChart !: any[];

  protected showXAxis = true;
  protected showYAxis = true;
  protected gradient = false;
  protected showXAxisLabel = true;
  protected xAxisLabel = 'Equipo';
  protected showYAxisLabel = true;
  protected yAxisLabel = 'Cantidad';
  protected colorScheme = 'ocean'

  // options
  protected showLabels: boolean = true;
  protected isDoughnut: boolean = false;

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
    this.loading = true;
    this.equipoService.getAllByIdPersona(idPersona)
      .subscribe(equipments => {
        this.equipos = equipments;
        this.loading = false;
      });
  }

  private getServiceAmount(idPersona: string) {
    this.equipoService.getServiceAmountClient(idPersona)
      .subscribe(data => {
        this.cantidadServiciosFinPen = data;
        this.endStartedServicesChart = [
          {
            name: 'Finalizados',
            value: data.finalizados
          },
          {
            name: 'Pendientes',
            value: data.pendientes
          }
        ];
      });
  }

  private getEquipmentActiveInactive(idPersona: string) {
    this.equipoService.getEquipmentsActiveInactiveClient(idPersona)
      .subscribe((data: EquipoActivoInactivo[]) => {
        this.cantidadActivoInactivo = data;

        this.activeInactiveChart = data.map(d => {
          return {
            name: (d.estado) ? 'Activos' : 'Inactivos',
            value: d.cantidad
          }
        });
      });
  }

  private getEquipmentMinMax(idPersona: string) {
    this.equipoService.getEquipmentMaxMinClient(idPersona)
      .subscribe((data: EquipoMaxMinCliente) => {
        this.equiposMaxMin = data;
        this.chartMinMax = [
          {
            name: data.equipmentMin.nombre + ' ' + data.equipmentMin.modelo,
            value: data.equipmentMin.cantidad
          },
          {
            name: data.equipmentMax.nombre + ' ' + data.equipmentMax.modelo,
            value: data.equipmentMax.cantidad
          }
        ];
      });
  }

  protected updateEquipmentManager(idEquipo: number, dto: UpdateEquipoDTO) {
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
      });
  }

  protected parseDate(date: Date | null) {
    if (date) {
      return formatDate(date, 'medium', 'es');
    }
    return 'No ingresada';
  }

  protected state(bol : boolean){
    return bol ? 'Activo' : 'Inactivo';
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
      estado: equipment.estado
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

  protected get department() {
    if (this.equipo && this.equipo.Direccion?.Municipio?.Departamento?.Pais) {
      return this.equipo.Direccion?.Municipio?.Departamento?.Pais?.nombre + ", " + this.equipo.Direccion?.Municipio?.Departamento?.nombre
    }
    return "No ingresado"
  }

  protected get direction() {
    if (this.equipo && this.equipo.Direccion?.Municipio) {
      return this.equipo.Direccion?.Municipio.nombre + " " + this.equipo.Direccion.direccion
    }
    return "No ingresado"
  }

  private clearInput() {
    this.filter = "";
  }
}
