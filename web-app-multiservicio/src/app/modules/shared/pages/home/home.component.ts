import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPermissions } from '../Intefaces/IPermissions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  rol: string | null = null;

  public permissions!: IPermissions[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getRol();
  }

  getRol(){
    this.rol = localStorage.getItem('rol');
    if (!this.rol) {
      this.router.navigate(['/']);
    }
  }

  getPermissions(rol: string): any {

    switch(rol) {
      case "Gerente General":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: '/gerente-general/home'
          },
          {
            permissionName: 'Auditoria Servicio',
            routerName: 'auditoria-servicio'
          },
          {
            permissionName: 'Analisis Repuesto',
            routerName: 'analisis-repuesto'
          },
          {
            permissionName: 'Empresa',
            routerName: 'empresa'
          },
          {
            permissionName: 'Dirección',
            routerName: 'direccion'
          },
          {
            permissionName: 'Municipio',
            routerName: 'municipio'
          },
          {
            permissionName: 'Departamento',
            routerName: 'departamento'
          },
          {
            permissionName: 'Tipo Telefono',
            routerName: 'tipo-telefono'
          },
          {
            permissionName: 'Telefono',
            routerName: 'telefono'
          },
          {
            permissionName: 'Persona',
            routerName: 'persona'
          },
          {
            permissionName: 'Tipo Persona',
            routerName: 'tipo-persona'
          },
          {
            permissionName: 'Tipo Repuesto',
            routerName: 'tipo-repuesto'
          },
          {
            permissionName: 'Repuesto',
            routerName: 'repuesto'
          },
          {
            permissionName: 'Equipo',
            routerName: 'equipo'
          },
          {
            permissionName: 'Servicio',
            routerName: 'servicio'
          },
          {
            permissionName: 'Perfil',
            routerName: 'perfil'
          }
        ]
        break;
      
      case "Trabajador Operacional":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: 'home'
          },
          {
            permissionName: 'Repuesto',
            routerName: 'repuesto'
          },
          {
            permissionName: 'Servicio',
            routerName: 'servicio'
          },
          {
            permissionName: 'Telefono',
            routerName: 'telefono'
          },
          {
            permissionName: 'Perfil',
            routerName: 'perfil'
          }
        ]
        break;

      case "Cliente":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: 'home'
          },
          {
            permissionName: 'Equipo',
            routerName: 'equipo'
          },
          {
            permissionName: 'Servicio',
            routerName: 'servicio'
          },
          {
            permissionName: 'Telefono',
            routerName: 'telefono'
          },
          {
            permissionName: 'Perfil',
            routerName: 'perfil'
          }
        ]
        break;
    }
  }

}
