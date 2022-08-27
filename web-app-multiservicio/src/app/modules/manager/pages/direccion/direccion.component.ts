import { Component, OnInit } from '@angular/core';
import { CreateDireccionDTO, DireccionRelacionesAnidadas, UpdateDireccionDTO } from 'src/app/models/direccion.model';
import { Municipio } from 'src/app/models/municipio.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { MunicipioService } from 'src/app/services/municipio.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionComponent implements OnInit {

  protected direccion: DireccionRelacionesAnidadas | null = null;
  protected direcciones: DireccionRelacionesAnidadas[] = [];
  protected municipios: Municipio[] = [];
  protected loading = false;
  protected filter = "";

  public Form     !: FormGroup;
  public newItem  !: boolean;
  public idItem   !: number;

  constructor(
    private direccionService: DireccionService,
    private municipioService: MunicipioService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllAddressesWithRelations();
    this.getAllMunicipalitiesToUpdateAddresses();
    this.initForm();
  }

  protected getAllMunicipalitiesToUpdateAddresses() {
    this.loading = true;
    this.municipioService.getAll()
      .subscribe(municipalities => {
        this.municipios = municipalities;
        this.loading = false;
      });
  }

  private getAllAddressesWithRelations() {
    this.loading = true;
    this.direccionService.getAllWithRelations()
      .subscribe(addresses => {
        this.direcciones = addresses;        
        this.loading = false;
      });
  }

  protected getOneAddress(idDireccion: number) {
    this.direccion = this.direcciones.find(address => address.idDireccion = idDireccion) as DireccionRelacionesAnidadas;
    if (this.direccion) {
      // show content
    }
  }

  protected createAddress(dto: CreateDireccionDTO) {
    this.loading = true;
    this.direccionService.create(dto)
      .subscribe(address => {
        if (address) {
          // Success
          this.direcciones.push(address);
          Swal.fire({
            icon  : 'success',
            title : 'Creado',
            text  : 'Dirección creada'
          })
        }
        this.loading = false;
      });
  }

  protected updateAddress(idDireccion: number, dto: UpdateDireccionDTO) {
    this.loading = true;
    this.direccionService.update(idDireccion, dto)
      .subscribe(res => {
        if (res) {
          const addressIndex = this.direcciones.findIndex(
            (res) => res.idDireccion === idDireccion);
          this.direcciones[addressIndex] = res;
          // Success
        }
        this.loading = false;
      });
  }

  protected deleteAddress(idDireccion: number) {
    this.loading = true;
    this.direccionService.delete(idDireccion)
      .subscribe(res => {
        if (res) {
          const addressIndex = this.direcciones.findIndex(
            (address) => address.idDireccion === idDireccion);
          this.direcciones.splice(addressIndex, 1);
          // Success
          Swal.fire({
            icon  : 'success',
            title : 'Eliminado',
            text  : 'Dirección eliminada'
          })
        }
        this.loading = false;
      });
  }

  initForm() {
    this.newItem = true;
    this.Form = this.fb.group({
      direccion   : ['', [Validators.required, Validators.maxLength(250)]],
      idMunicipio : ['', Validators.required]
    })
  }

  setForm(municipio: DireccionRelacionesAnidadas) {

    this.idItem = municipio.idDireccion;
  }

  openModal(direccion?: DireccionRelacionesAnidadas) {
    this.initForm();

    if (direccion) {
      this.newItem = false;
      return this.setForm(direccion);
    }
  }

  createItem() {
    if (this.Form.invalid) return Object.values(this.Form.controls).forEach(c => c.markAsTouched());    

    this.createAddress(this.Form.value)
  }

  deleteItem() {
    Swal.fire({
      title : '¡Atención!',
      text  : '¿Está seguro de eliminar el municipio?',
      icon  : 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {

      if (res.isConfirmed) {
        this.deleteAddress(this.idItem);
      }

    })
  }

}
