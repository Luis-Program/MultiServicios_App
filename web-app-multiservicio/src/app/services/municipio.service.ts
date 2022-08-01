import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateMunicipioDTO, Municipio, MunicipioRelacionesAnidadas, UpdateMunicipioDTO } from '../models/municipio.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/municipios`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<Municipio[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    return this.http.get<MunicipioRelacionesAnidadas[]>(`${this.apiUrl}/relaciones`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idMunicipio: number | string) {
    return this.http.get<MunicipioRelacionesAnidadas>(`${this.apiUrl}/${idMunicipio}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateMunicipioDTO) {
    return this.http.post<MunicipioRelacionesAnidadas>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idMunicipio: number | string, dto: UpdateMunicipioDTO) {
    return this.http.patch<MunicipioRelacionesAnidadas>(`${this.apiUrl}/${idMunicipio}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idMunicipio: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idMunicipio}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
