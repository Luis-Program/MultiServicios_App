import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Auditoria_servicio } from '../models/auditoria_servicio.model';
import { manageError } from './shared/manage-error';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuditoriaServicioService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/auditoriaservicios`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<Auditoria_servicio[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idAuditoriaServicio: number | string) {
    return this.http.get<Auditoria_servicio>(`${this.apiUrl}/${idAuditoriaServicio}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
