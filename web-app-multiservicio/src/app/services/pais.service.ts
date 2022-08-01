import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { CreatePaisDTO, Pais, UpdatePaisDTO } from '../models/pais.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/paises`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<Pais[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idPais: number | string) {
    return this.http.get<Pais>(`${this.apiUrl}/${idPais}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreatePaisDTO) {
    return this.http.post<Pais>(`${this.apiUrl}`, dto)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return manageError(error, this.router);
      }));
  }

  public update(idPais: number | string, dto: UpdatePaisDTO) {
    return this.http.patch<Pais>(`${this.apiUrl}/${idPais}`, dto)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return manageError(error, this.router);
      }));
  }

  public delete(idPais: number | string) {
    return this.http.delete<number>(`${this.apiUrl}/${idPais}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return manageError(error, this.router);
      }));
  }
}
