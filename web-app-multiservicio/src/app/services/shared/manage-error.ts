import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Router } from "@angular/router";
import { throwError } from "rxjs";

export function manageError(error: HttpErrorResponse, router:Router) {
  if (error.status === HttpStatusCode.Conflict) {
    router.navigate(['error/error-servidor']);
    return throwError(() => new Error('Error del servidor, código 500.'));
  }
  if (error.status === HttpStatusCode.NotFound) {
    router.navigate(['error/no-encontrado']);
    return throwError(() => new Error('Elemento no encontrado, código 404.'));
  }
  if (error.status === HttpStatusCode.Unauthorized) {
    router.navigate(['error/no-autorizado']);
    return throwError(() => new Error('No autorizado, código 401.'));
  }
  router.navigate(['error']);
  return throwError(() => new Error('Error '+error+'.'));
}
