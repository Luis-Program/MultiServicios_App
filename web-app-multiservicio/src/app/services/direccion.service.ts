import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateDireccionDTO, Direccion, DireccionDropDown, DireccionRelacionesAnidadas, UpdateDireccionDTO } from '../models/direccion.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/direcciones`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<Direccion[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    return this.http.get<DireccionRelacionesAnidadas[]>(`${this.apiUrl}/relaciones`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllDropDown() {
    return this.http.get<DireccionDropDown[]>(`${this.apiUrl}/dropdown`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idDireccion: number | string) {
    return this.http.get<DireccionRelacionesAnidadas>(`${this.apiUrl}/${idDireccion}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateDireccionDTO) {
    return this.http.post<DireccionRelacionesAnidadas>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idDireccion: number | string, dto: UpdateDireccionDTO) {
    return this.http.patch<DireccionRelacionesAnidadas>(`${this.apiUrl}/${idDireccion}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idDireccion: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idDireccion}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
