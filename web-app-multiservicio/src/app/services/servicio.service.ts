import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateServicioDTO, Servicio, ServicioRelaciones, ServiciosCantidad, ServiciosCantidadPorTipoServicio, ServiciosFinalizadosPendientesTrabajador, ServicioTrabajador, UpdateServicioDTO } from '../models/servicio.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getAPI() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios`;
      } else if (rol === 'Trabajador Operacional') {
        this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/servicios`;
      } else if (rol === 'Cliente') {
        this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/servicios`;
      }
    }
  }

  public getAll() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios`;
    return this.http.get<Servicio[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios/relaciones`;
    return this.http.get<ServicioRelaciones[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllByIdEmployee(idTrabajador: number | string) {
    this.getAPI();
    return this.http.get<ServicioTrabajador[]>(`${this.apiUrl}/idTrabajador/${idTrabajador}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAmountServicesCompletedAsigned() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios/cantidadservicios`;
    return this.http.get<ServiciosCantidad>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAmountServicesWorker(idTrabajador: number | string) {
    this.getAPI();
    return this.http.get<ServiciosFinalizadosPendientesTrabajador>(`${this.apiUrl}/trabajador/${idTrabajador}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getServiceAmountTypeService() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios/cantidadportiposervicio`;
    return this.http.get<ServiciosCantidadPorTipoServicio>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllByIdEquipo(idEquipo: number | string) {
    this.getAPI();
    return this.http.get<ServicioRelaciones[]>(`${this.apiUrl}/idequipo/${idEquipo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
  // Cliente
  public getAllByIdEquipoCompleted(idEquipo: number | string) {
    this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/servicios`;
    return this.http.get<ServicioRelaciones[]>(`${this.apiUrl}/completados/${idEquipo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllByIdEquipoNotCompleted(idEquipo: number | string) {
    this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/servicios`;
    return this.http.get<ServicioRelaciones[]>(`${this.apiUrl}/pendientes/${idEquipo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
  // Gerente General
  public getAllServicesCompleted() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios`;
    return this.http.get<ServicioRelaciones[]>(`${this.apiUrl}/completados`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllServicesNotCompleted() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/servicios`;
    return this.http.get<ServicioRelaciones[]>(`${this.apiUrl}/pendientes`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  // Empleado

  public getAllServicesCompletedByIdWorker(idTrabajador: string | number) {
    this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/servicios`;
    return this.http.get<ServicioTrabajador[]>(`${this.apiUrl}/completados/${idTrabajador}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllServicesNotCompletedByIdWorker(idTrabajador: string | number) {
    this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/servicios`;
    return this.http.get<ServicioTrabajador[]>(`${this.apiUrl}/pendientes/${idTrabajador}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idServicio: number | string) {
    this.getAPI();
    return this.http.get<ServicioRelaciones>(`${this.apiUrl}/${idServicio}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateServicioDTO) {
    this.getAPI();
    return this.http.post<ServicioRelaciones>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idServicio: number | string, dto: UpdateServicioDTO) {
    this.getAPI();
    return this.http.patch<ServicioRelaciones>(`${this.apiUrl}/${idServicio}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public updateWorker(idServicio: number | string, dto: UpdateServicioDTO) {
    this.getAPI();
    return this.http.patch<ServicioTrabajador>(`${this.apiUrl}/${idServicio}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idServicio: number | string) {
    this.getAPI();
    return this.http.delete<number>(`${this.apiUrl}/${idServicio}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
