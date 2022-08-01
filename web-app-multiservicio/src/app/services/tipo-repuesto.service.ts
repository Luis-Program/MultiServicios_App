import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateTipoRepuestoDTO, TipoRepuesto, UpdateTipoRepuestoDTO } from '../models/tipo_repuesto.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoRepuestoService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/tiposrepuestos`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<TipoRepuesto[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idTipoRepuesto: number | string) {
    return this.http.get<TipoRepuesto>(`${this.apiUrl}/${idTipoRepuesto}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateTipoRepuestoDTO) {
    return this.http.post<TipoRepuesto>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idTipoRepuesto: number | string, dto: UpdateTipoRepuestoDTO) {
    return this.http.patch<TipoRepuesto>(`${this.apiUrl}/${idTipoRepuesto}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idTipoRepuesto: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idTipoRepuesto}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
