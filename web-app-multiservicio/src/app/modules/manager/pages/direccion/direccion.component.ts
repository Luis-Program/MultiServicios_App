import { Component, OnInit } from '@angular/core';
import { CreateDireccionDTO, DireccionRelacionesAnidadas, UpdateDireccionDTO } from 'src/app/models/direccion.model';
import { Municipio } from 'src/app/models/municipio.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { MunicipioService } from 'src/app/services/municipio.service';

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

  constructor(
    private direccionService: DireccionService,
    private municipioService: MunicipioService
  ) { }

  ngOnInit(): void {
    this.getAllAddressesWithRelations();
    // this.loadData();
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
        }
        this.loading = false;
      });
  }
}
