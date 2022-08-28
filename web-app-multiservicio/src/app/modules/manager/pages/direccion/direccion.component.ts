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

  protected createAddress(dto: CreateDireccionDTO) {
    this.loading = true;
    this.direccionService.create(dto)
      .subscribe(address => {
        if (address) {
          this.direcciones.push(address);
          this.clearInput();
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
          this.clearInput();
          Swal.fire({
            icon  : 'success',
            title : 'Actualizado',
            text  : 'Dirección actualizada'
          })
          this.getAllAddressesWithRelations();
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
          this.clearInput();
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
      idDireccion : [''],
      direccion   : ['', [Validators.required, Validators.maxLength(250)]],
      idMunicipio : ['', Validators.required],
    })
  }

  setForm(direccion: DireccionRelacionesAnidadas) {

    let idMuncipio = null;
    (direccion.Municipio?.idMunicipio) ? idMuncipio = direccion.Municipio.idMunicipio : idMuncipio = 0;

    let nombreDepartamento = '';
    (direccion.Municipio?.Departamento?.nombre) ? nombreDepartamento = direccion.Municipio?.Departamento?.nombre : nombreDepartamento = 'No ingresado'

    let nombrePais = '';
    (direccion.Municipio?.Departamento?.Pais?.nombre) ? nombrePais = direccion.Municipio?.Departamento?.Pais?.nombre : nombrePais = 'No ingresado'

    this.Form.setValue({
      idDireccion: direccion.idDireccion,
      direccion: direccion.direccion,
      idMunicipio: idMuncipio
    })

    this.Form.addControl('departamento', this.fb.control(nombreDepartamento));
    this.Form.addControl('pais', this.fb.control(nombrePais));
    this.idItem = direccion.idDireccion;
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

    const { idDireccion, departamento, pais, ...rest } = this.Form.value;

    if (idDireccion) {
      return this.updateAddress(idDireccion, rest);
    }

    this.createAddress(rest);
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

  get f() {
    return this.Form;
  }

  get idMunicipio() {
    return this.Form.get('idMunicipio')?.value;
  }

  private clearInput() {
    this.filter = "";
  }
}
