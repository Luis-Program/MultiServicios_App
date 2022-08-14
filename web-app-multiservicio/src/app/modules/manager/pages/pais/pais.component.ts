import { Component, OnInit } from '@angular/core';
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

  constructor(
    private paisService: PaisService
  ) { }

  ngOnInit(): void {
    this.getAllCountries();
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
}
