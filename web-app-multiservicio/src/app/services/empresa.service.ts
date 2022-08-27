import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateEmpresaDTO, Empresa, EmpresaRelaciones, MinMaxEmpresa, UpdateEmpresaDTO } from '../models/empresa.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/empresas`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<Empresa[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idEmpresa: number | string) {
    return this.http.get<Empresa>(`${this.apiUrl}/${idEmpresa}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getMinMaxClients() {
    return this.http.get<MinMaxEmpresa[]>(`${this.apiUrl}/maxminclientesempresa`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateEmpresaDTO) {
    return this.http.post<Empresa>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idEmpresa: number | string, dto: UpdateEmpresaDTO) {
    return this.http.patch<Empresa>(`${this.apiUrl}/${idEmpresa}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idEmpresa: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idEmpresa}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
