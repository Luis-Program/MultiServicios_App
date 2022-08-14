import { Injectable } from '@angular/core';
import { Analisis_Repuesto, Graphics } from '../models/analisis_repuesto.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AnalisisRepuestoService {

  private apiUrl = `${environment.API_URL_MANAGER}/api/v1/analisisrepuestos`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getAll() {
    return this.http.get<Analisis_Repuesto[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getDataGraphics(nombreRepuesto: string) {
    return this.http.get<Graphics[]>(`${this.apiUrl}/nombrerepuesto/${nombreRepuesto}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
