import { Component, OnInit } from '@angular/core';
import { CreateTipoTelefonoDTO, TipoTelefono, UpdateTipoTelefonoDTO } from 'src/app/models/tipo_telefono.model';
import { TipoTelefonoService } from 'src/app/services/tipo-telefono.service';

@Component({
  selector: 'app-tipo-stelefono',
  templateUrl: './tipo-telefono.component.html',
  styleUrls: ['./tipo-telefono.component.css']
})
export class TipoTelefonoComponent implements OnInit {

  protected tiposTelefonos: TipoTelefono[] = [];
  protected loading = false;
  protected filter = "";

  constructor(
    private tipotelefonoService: TipoTelefonoService
  ) { }

  ngOnInit(): void {
    this.getAllPhoneTypes();
  }

  private getAllPhoneTypes() {
    this.loading = true;
    this.tipotelefonoService.getAll()
      .subscribe(phonesTypes => {
        this.tiposTelefonos = phonesTypes;
        this.loading = false;
      });
  }

  protected createPhoneTypes(dto: CreateTipoTelefonoDTO) {
    this.loading = true;
    this.tipotelefonoService.create(dto)
      .subscribe(phoneType => {
        if (phoneType) {
          this.clearInput();
          this.tiposTelefonos.push(phoneType);
        }
        this.loading = false;
      });
  }

  protected updatePhoneTypes(idTipoTelefono: number, dto: UpdateTipoTelefonoDTO) {
    this.loading = true;
    this.tipotelefonoService.update(idTipoTelefono, dto)
      .subscribe(phoneType => {
        if (phoneType) {
          const phoneTypeIndex = this.tiposTelefonos.findIndex(
            (res) => res.idTipoTelefono === idTipoTelefono);
          this.tiposTelefonos[phoneTypeIndex] = phoneType;
          this.clearInput();
        }
        this.loading = false;
      });
  }

  protected deletePhoneTypes(idTipoTelefono: number) {
    this.loading = true;
    this.tipotelefonoService.delete(idTipoTelefono)
      .subscribe(res => {
        if (res) {
          const phoneTypeIndex = this.tiposTelefonos.findIndex(
            (phoneType) => phoneType.idTipoTelefono === idTipoTelefono);
          this.tiposTelefonos.splice(phoneTypeIndex, 1);
          this.clearInput();
        }
        this.loading = false;
      });
  }

  private clearInput() {
    this.filter = "";
  }

}
