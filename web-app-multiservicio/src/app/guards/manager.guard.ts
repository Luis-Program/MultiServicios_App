import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkRol();
    // return true;
  }

  checkRol() {
    const rol = localStorage.getItem('rol');
    if (rol && rol === 'Gerente General') {
      return true
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }

}
