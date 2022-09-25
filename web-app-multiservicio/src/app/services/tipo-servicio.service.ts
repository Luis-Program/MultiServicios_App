import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { TipoServicio } from '../models/tipo_servicio.model';
import { Router } from '@angular/router';
import { getRol } from '../modules/shared/local-storage/localStorage';

@Injectable({
  providedIn: 'root'
})
export class TipoServicioService {

  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getAPI() {
    const rol = getRol();
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/tiposservicios`;
      } else if (rol === 'Cliente') {
        this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/tiposservicios`;
      }
    }
  }

  public getAll() {
    this.getAPI();
    return this.http.get<TipoServicio[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

}
