import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateTipoPersonaDTO, TipoPersona, TipoPersonaRelaciones, UpdateTipoPersonaDTO } from '../models/tipo_persona.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoPersonaService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/tipospersonas`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<TipoPersona[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllDropDown() {
    return this.http.get<TipoPersona[]>(`${this.apiUrl}/dropdown`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    return this.http.get<TipoPersonaRelaciones[]>(`${this.apiUrl}/relaciones`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idTipoPersona: number | string) {
    return this.http.get<TipoPersonaRelaciones>(`${this.apiUrl}/${idTipoPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateTipoPersonaDTO) {
    return this.http.post<TipoPersonaRelaciones>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idTipoPersona: number | string, dto: UpdateTipoPersonaDTO) {
    return this.http.patch<TipoPersonaRelaciones>(`${this.apiUrl}/${idTipoPersona}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idTipoPersona: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idTipoPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
