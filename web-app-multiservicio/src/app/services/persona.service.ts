import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { manageError } from './shared/manage-error';
import { Clientes, CreatePersonaDTO, Persona, PersonaDropdown, PersonaRelaciones, ServiciosFinalizadosPendientes, Trabajadores, TrabajadoresDropDown, TrabajadoresMinMaxServicios, UpdatePersonaDTO } from '../models/persona.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getAPI() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      if (rol === 'Gerente General') {
        this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
      } else if (rol === 'Trabajador Operacional') {
        this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/personas`;
      } else if (rol === 'Cliente') {
        this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/personas`;
      }
    }
  }

  public getOneByEmail(email: string) {
    // this.apiUrl = `${environment.API_URL_EMPLOYEE}/api/v1/personas`;
    // this.apiUrl = `${environment.API_URL_CLIENT}/api/v1/personas`;
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<PersonaRelaciones>(`${this.apiUrl}/correo/${email}`)
      .pipe(
        retry(3),
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWithRelations() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<PersonaRelaciones[]>(`${this.apiUrl}/relaciones`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAll() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<Persona[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllDropDown(){
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas/dropdown`;
    return this.http.get<PersonaDropdown[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWorkersWithServices() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<Trabajadores[]>(this.apiUrl + '/trabajadores')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllWorkersWithServicesDropDown() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<TrabajadoresDropDown[]>(this.apiUrl + '/workersdropdown')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }


  public getWorkersMinMaxServices(){
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<TrabajadoresMinMaxServicios[]>(this.apiUrl + '/personaservices')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getClientsWithAmountEquipsMinMax() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<Clientes[]>(this.apiUrl + '/personasminmaxequipos')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllCients() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<PersonaDropdown[]>(this.apiUrl + '/clientes')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getAllCientsEquipments() {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.get<Clientes[]>(this.apiUrl + '/clientesequipos')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOne(idPersona: number | string) {
    this.getAPI();
    return this.http.get<PersonaRelaciones>(`${this.apiUrl}/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public getOneWorkerServicesAmount(idPersona: number | string) {
    this.getAPI();
    return this.http.get<ServiciosFinalizadosPendientes>(`${this.apiUrl}/trabajador/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public create(dto: CreatePersonaDTO) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.post<PersonaRelaciones>(`${this.apiUrl}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public update(idPersona: number | string, dto: UpdatePersonaDTO) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.patch<PersonaRelaciones>(`${this.apiUrl}/${idPersona}`, dto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }

  public delete(idPersona: number | string) {
    this.apiUrl = `${environment.API_URL_MANAGER}/api/v1/personas`;
    return this.http.delete<number>(`${this.apiUrl}/${idPersona}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return manageError(error, this.router);
        }));
  }
}
