import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateEquipoDTO, Equipo, EquipoActivoInactivo, EquipoCliente, EquipoClienteServicios, EquipoMaxMinCliente, EquipoRelaciones, EquipoRelacionesAnidadas, UnEquipoServicios, UpdateEquipoDTO } from '../models/equipo.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getAPI() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/equipos`;
      } else if (rol === 'Cliente') {
        this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/equipos`;
      }
    }
  }

  public getAll() {
    this.getAPI();
    return this.http.get<Equipo[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllEquipments() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/equipos/relaciones`;
    return this.http.get<EquipoRelacionesAnidadas[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
  // Get all client
  public getAllByIdPersona(idPersona: number | string) {
    this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/equipos`;
    return this.http.get<EquipoCliente[]>(`${this.apiUrl}/idPersona/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
  // Get Amount finished and in execution
  public getServiceAmountClient(idPersona: number | string) {
    this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/equipos`;
    return this.http.get<EquipoClienteServicios>(`${this.apiUrl}/servicios/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
  // Get active inactive
  public getEquipmentsActiveInactiveClient(idPersona: number | string) {
    this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/equipos`;
    return this.http.get<EquipoActivoInactivo[]>(`${this.apiUrl}/cantidadactivoinactivo/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  // Get Max Min Client
  public getEquipmentMaxMinClient(idPersona: number | string) {
    this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/equipos`;
    return this.http.get<EquipoMaxMinCliente>(`${this.apiUrl}/equipomenormayorserivicios/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOneEquipmentsServices(idEquipo: number | string) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/equipos`;
    return this.http.get<UnEquipoServicios>(`${this.apiUrl}/servicioscompen/${idEquipo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idEquipo: number | string) {
    this.getAPI();
    return this.http.get<EquipoRelaciones>(`${this.apiUrl}/${idEquipo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getEquipmentsActiveInactive() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/equipos`;
    return this.http.get<EquipoActivoInactivo[]>(`${this.apiUrl}/cantidadactivoinactivo`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOneClient(idEquipo: number | string) {
    return this.http.get<EquipoCliente>(`${this.apiUrl}/${idEquipo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateEquipoDTO) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/equipos`;
    return this.http.post<EquipoRelacionesAnidadas>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public updateManager(idEquipo: number | string, dto: UpdateEquipoDTO) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/equipos`;
    return this.http.patch<EquipoRelacionesAnidadas>(`${this.apiUrl}/${idEquipo}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public updateClient(idEquipo: number | string, dto: UpdateEquipoDTO) {
    this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/equipos`;
    return this.http.patch<EquipoCliente>(`${this.apiUrl}/${idEquipo}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idEquipo: number | string) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/equipos`;
    return this.http.delete<number>(`${this.apiUrl}/${idEquipo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
