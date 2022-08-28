import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreateRepuestoDTO, Repuesto, RepuestoRelaciones, UpdateRepuestoDTO } from '../models/repuesto.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {

  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getAPI() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/repuestos`;
      } else if (rol === 'Trabajador Operacional') {
        this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/repuestos`;
      }
    }
  }

  public getAllWithRelations() {
    this.getAPI();
    return this.http.get<RepuestoRelaciones[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idRepuesto: number) {
    this.getAPI();
    return this.http.get<RepuestoRelaciones>(`${this.apiUrl}/${idRepuesto}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreateRepuestoDTO) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/repuestos`;
    return this.http.post<RepuestoRelaciones>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idRepuesto: number | string, dto: UpdateRepuestoDTO) {
    this.getAPI();
    return this.http.patch<RepuestoRelaciones>(`${this.apiUrl}/${idRepuesto}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idRepuesto: number | string) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/repuestos`;
    return this.http.delete<number>(`${this.apiUrl}/${idRepuesto}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
