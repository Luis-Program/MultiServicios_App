import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateTipoTelefonoDTO, TipoTelefono, UpdateTipoTelefonoDTO } from '../models/tipo_telefono.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoTelefonoService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/tipostelefonos`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<TipoTelefono[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idTipoTelefono: number | string) {
    return this.http.get<TipoTelefono>(`${this.apiUrl}/${idTipoTelefono}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateTipoTelefonoDTO) {
    return this.http.post<TipoTelefono>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idTipoTelefono: number | string, dto: UpdateTipoTelefonoDTO) {
    return this.http.patch<TipoTelefono>(`${this.apiUrl}/${idTipoTelefono}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idTipoTelefono: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idTipoTelefono}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}

