import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { Notificacion, UpdateNotificacionDTO } from '../models/notificacion.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAPI() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/notificaciones`;
      } else if (rol === 'Trabajador Operacional') {
        this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/notificaciones`;
      } else if (rol === 'Cliente') {
        this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/notificaciones`;
      }
    }
  }

  public getAll(idPersona: string) {
    this.getAPI();
    return this.http.get<Notificacion[]>(`${this.apiUrl}/persona/${idPersona}`)
      .pipe(
        retry(3),
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public setReadNotifications(idPersona: string | number) {
    this.getAPI();
    return this.http.get<Notificacion[]>(`${this.apiUrl}/visto/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idNotificacion: number | string, dto: UpdateNotificacionDTO) {
    return this.http.patch<Notificacion>(`${this.apiUrl}/${idNotificacion}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idNotificacion: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idNotificacion}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public deleteAll(idPersona: number | string) {
    console.log("eliminado: "+idPersona)
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
