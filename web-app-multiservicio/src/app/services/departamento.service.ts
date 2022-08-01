import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateDepartamentoDTO, Departamento, DepartamentoRelaciones, UpdateDepartamentoDTO } from '../models/departamento.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/departamentos`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<Departamento[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    return this.http.get<DepartamentoRelaciones[]>(`${this.apiUrl}/relaciones`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idDepartamento: number | string) {
    return this.http.get<DepartamentoRelaciones>(`${this.apiUrl}/${idDepartamento}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateDepartamentoDTO) {
    return this.http.post<DepartamentoRelaciones>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idDepartamento: number | string, dto: UpdateDepartamentoDTO) {
    return this.http.patch<DepartamentoRelaciones>(`${this.apiUrl}/${idDepartamento}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idDepartamento: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idDepartamento}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
