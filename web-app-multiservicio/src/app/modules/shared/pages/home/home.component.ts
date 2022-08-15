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

  getRol(): any {
    this.rol = localStorage.getItem('rol');
    if (!this.rol) {
      return this.router.navigate(['/']);
    }

    this.getPermissions(this.rol!);
    console.log(this.permissions);
    
  }

  getPermissions(rol: string): any {

    switch(rol) {
      case "Gerente General":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: '/gerente-general/home',
            icon: 'mdi mdi-home-variant'
          },
          {
            permissionName: 'Auditoria Servicio',
            routerName: 'auditoria-servicio',
            icon: 'mdi mdi-briefcase-check'
          },
          {
            permissionName: 'Analisis Repuesto',
            routerName: 'analisis-repuesto',
            icon: 'mdi mdi-check-all'
          },
          {
            permissionName: 'Empresa',
            routerName: 'empresa',
            icon: 'fa fa-building-o'
          },
          {
            permissionName: 'Dirección',
            routerName: 'direccion',
            icon: 'mdi mdi-directions-fork'
          },
          {
            permissionName: 'Municipio',
            routerName: 'municipio',
            icon: 'mdi mdi-city'
          },
          {
            permissionName: 'Departamento',
            routerName: 'departamento',
            icon: 'mdi mdi-directions'
          },
          {
            permissionName: 'País',
            routerName: 'pais',
            icon: 'mdi mdi-directions'
          },
          {
            permissionName: 'Tipo Telefono',
            routerName: 'tipo-telefono',
            icon: 'mdi mdi-phone-classic'
          },
          {
            permissionName: 'Telefono',
            routerName: 'telefono',
            icon: 'mdi mdi-phone'
          },
          {
            permissionName: 'Persona',
            routerName: 'persona',
            icon: 'mdi mdi-account'
          },
          {
            permissionName: 'Tipo Persona',
            routerName: 'tipo-persona',
            icon: 'mdi mdi-account-alert'
          },
          {
            permissionName: 'Tipo Repuesto',
            routerName: 'tipo-repuesto',
            icon: 'Tipo Repuesto'
          },
          {
            permissionName: 'Repuesto',
            routerName: 'repuesto',
            icon: 'mdi mdi-engine'
          },
          {
            permissionName: 'Equipo',
            routerName: 'equipo',
            icon: 'mdi mdi-server'
          },
          {
            permissionName: 'Servicio',
            routerName: 'servicio',
            icon: 'mdi mdi-server-network'
          },
          {
            permissionName: 'Perfil',
            routerName: 'perfil',
            icon: 'mdi mdi-account-circle'
          }
        ]
        break;
      
      case "Trabajador Operacional":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: 'home',
            icon: 'mdi mdi-home-variant'
          },
          {
            permissionName: 'Repuesto',
            routerName: 'repuesto',
            icon: 'mdi mdi-engine'
          },
          {
            permissionName: 'Servicio',
            routerName: 'servicio',
            icon: 'mdi mdi-server-network'
          },
          {
            permissionName: 'Telefono',
            routerName: 'telefono',
            icon: 'mdi mdi-phone'
          },
          {
            permissionName: 'Perfil',
            routerName: 'perfil',
            icon: 'mdi mdi-account-circle'
          }
        ]
        break;

      case "Cliente":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: 'home',
            icon: 'mdi mdi-home-variant'
          },
          {
            permissionName: 'Equipo',
            routerName: 'equipo',
            icon: 'mdi mdi-server'
          },
          {
            permissionName: 'Servicio',
            routerName: 'servicio',
            icon: 'mdi mdi-server-network'
          },
          {
            permissionName: 'Telefono',
            routerName: 'telefono',
            icon: 'mdi mdi-phone'
          },
          {
            permissionName: 'Perfil',
            routerName: 'perfil',
            icon: 'mdi mdi-account-circle'
          }
        ]
        break;
    }
  }

}
