import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateTelefonoDTO, Telefono, TelefonoRelaciones, TelefonoRelacionTipoTelefono, UpdateTelefonoDTO } from '../models/telefono.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TelefonoService {

  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getAPI() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/telefonos`;
      } else if (rol === 'Trabajador Operacional') {
        this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/telefonos`;
      } else if (rol === 'Cliente') {
        this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/telefonos`;
      }
    }
  }

  public getAll() {
    this.getAPI();
    return this.http.get<Telefono[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    this.getAPI();
    return this.http.get<TelefonoRelaciones[]>(this.apiUrl+"/relaciones")
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllByIdPersona(idPersona: number | string) {
    this.getAPI();
    return this.http.get<TelefonoRelacionTipoTelefono[]>(`${this.apiUrl}/idPersona/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  // Manager
  public getOneManager(idTelefono: number | string) {
    this.getAPI();
    return this.http.get<TelefonoRelaciones>(`${this.apiUrl}/${idTelefono}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public createManager(dto: CreateTelefonoDTO) {
    this.getAPI();
    return this.http.post<TelefonoRelaciones>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public updateManager(idTelefono: number | string, dto: UpdateTelefonoDTO) {
    this.getAPI();
    return this.http.patch<TelefonoRelaciones>(`${this.apiUrl}/${idTelefono}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  // Client and Employee
  public getOneClientEmployee(idTelefono: number | string) {
    this.getAPI();
    return this.http.get<TelefonoRelacionTipoTelefono>(`${this.apiUrl}/${idTelefono}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public createClientEmployee(dto: CreateTelefonoDTO) {
    this.getAPI();
    return this.http.post<TelefonoRelacionTipoTelefono>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public updateClientEmployee(idTelefono: number | string, dto: UpdateTelefonoDTO) {
    this.getAPI();
    return this.http.patch<TelefonoRelacionTipoTelefono>(`${this.apiUrl}/${idTelefono}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  //Global
  public delete(idTelefono: number | string) {
    this.getAPI();
    return this.http.delete<number>(`${this.apiUrl}/${idTelefono}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
