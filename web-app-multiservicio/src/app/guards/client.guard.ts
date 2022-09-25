import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getRol } from '../modules/shared/local-storage/localStorage';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {

  constructor(
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkRol();
  }

  checkRol() {
    const rol = getRol();
    if (rol &&  rol === 'Cliente') {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }

}
