import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateDireccionDTO, Direccion, DireccionDropDown, DireccionRelacionesAnidadas, UpdateDireccionDTO } from '../models/direccion.model';
import { Router } from '@angular/router';
import { getRol } from '../modules/shared/local-storage/localStorage';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  private apiUrl = ``;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getAPI() {
    const rol = getRol();
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/direcciones`;
      } else if (rol === 'Trabajador Operacional') {
        this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/direcciones`;
      }
    }
  }

  public getAll() {
    this.getAPI();
    return this.http.get<Direccion[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    this.getAPI();
    return this.http.get<DireccionRelacionesAnidadas[]>(`${this.apiUrl}/relaciones`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllDropDown() {
    this.getAPI();
    return this.http.get<DireccionDropDown[]>(`${this.apiUrl}/dropdown`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idDireccion: number | string) {
    this.getAPI();
    return this.http.get<DireccionRelacionesAnidadas>(`${this.apiUrl}/${idDireccion}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateDireccionDTO) {
    this.getAPI();
    return this.http.post<DireccionRelacionesAnidadas>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idDireccion: number | string, dto: UpdateDireccionDTO) {
    this.getAPI();
    return this.http.patch<DireccionRelacionesAnidadas>(`${this.apiUrl}/${idDireccion}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idDireccion: number | string) {
    this.getAPI();
    return this.http.delete<number>(`${this.apiUrl}/${idDireccion}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
