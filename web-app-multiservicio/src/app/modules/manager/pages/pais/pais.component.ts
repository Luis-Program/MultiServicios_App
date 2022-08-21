import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePaisDTO, Pais, UpdatePaisDTO } from 'src/app/models/pais.model';
import { PaisService } from 'src/app/services/pais.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {

  protected pais: Pais | null = null;
  protected paises: Pais[] = [];
  protected loading = false;

  public countryForm!: FormGroup;
  public newCountry!: Boolean;
  public idCountry!: number;

  constructor(
    private paisService: PaisService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllCountries();
    this.initForm();
  }

  private getAllCountries() {
    this.loading = true;
    this.paisService.getAll()
      .subscribe(countries => {
        this.paises = countries;
        this.loading = false;
      });
  }

  protected getOneCountry(idPais: number) {
    this.pais = this.paises.find(country => country.idPais = idPais) as Pais;
    if (this.pais) {
      // show content
    }
  }

  protected createCountry(pais: CreatePaisDTO) {
    this.loading = true;
    this.paisService.create(pais)
      .subscribe(country => {
        if (country) {
          // Success
          this.paises.push(country);
          Swal.fire({
            title : 'Creado',
            text  : 'País creado',
            icon  : 'success'
          })
        }
        this.loading = false;
      });
  }

  protected updateCountry(idPais: number, dto: UpdatePaisDTO) {
    this.loading = true;
    this.paisService.update(idPais, dto)
      .subscribe(res => {
        if (res) {
          const countryIndex = this.paises.findIndex(
            (res) => res.idPais === idPais);
          this.paises[countryIndex] = res;
          
            Swal.fire({
              title : "Actualizado",
              text  : "País actualizado",
              icon  : 'success'
            })

        }
        this.loading = false;
      });
  }

  protected deleteCountry(idPais: number) {
    this.loading = true;
    this.paisService.delete(idPais)
      .subscribe(res => {
        if (res) {
          const countryIndex = this.paises.findIndex(
            (res) => res.idPais === idPais);
          this.paises.splice(countryIndex, 1);
          // Success
          Swal.fire({
            title : 'Eliminado',
            text  : 'País eliminado',
            icon  : 'success'
          })
        }
        this.loading = false;
      });
  }

  openModalByCountry(country?: Pais) {
    this.initForm();
    
    if (country) {
      this.newCountry = false;
      this.setCountry(country);
    }
  }

  initForm() {
    this.newCountry = true;
    this.countryForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      codigo: ['', [Validators.required]],
    })
  }

  setCountry(country: Pais) {
    this.countryForm.setValue({
      nombre: country.nombre,
      codigo: country.codigo,
    })

    this.countryForm.addControl('idPais', this.fb.control(country.idPais, []));
    this.idCountry = country.idPais;
  }

  createCountryForm() {
    if (this.countryForm.invalid) return Object.values(this.countryForm.controls).forEach(c => c.markAsTouched());
    
    const { idPais, ...rest } = this.countryForm.value;

    if (idPais) {
      return this.updateCountry(idPais, rest);
    }
    
    return this.createCountry(this.countryForm.value);
  }

  deleteCountryModal() {
    Swal.fire({
      title : '¡Atención!',
      text  : '¿Está seguro de eliminar el país?',
      icon  : 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then((res: any) => {

      if (res.isConfirmed) {
        this.deleteCountry(this.idCountry);
      }
      
    })
  }
}
