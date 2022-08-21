import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePaisDTO, Pais, UpdatePaisDTO } from 'src/app/models/pais.model';
import { PaisService } from 'src/app/services/pais.service';

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
          // Success
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
      nombre: ['', [Validators.required, Validators.minLength(20)]],
      codigo: ['', [Validators.required]],
      idPais: []
    })
  }

  setCountry(country: Pais) {
    this.countryForm.setValue({
      nombre: country.nombre,
      codigo: country.codigo,
      idPais: country.idPais
    })
  }
}
