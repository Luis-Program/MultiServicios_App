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
            routerName: '/gerente-general/auditoria-servicio',
            icon: 'mdi mdi-briefcase-check'
          },
          {
            permissionName: 'Análisis Repuesto',
            routerName: '/gerente-general/analisis-repuesto',
            icon: 'mdi mdi-check-all'
          },
          {
            permissionName: 'Empresa',
            routerName: '/gerente-general/empresa',
            icon: 'fa fa-building-o'
          },
          {
            permissionName: 'Dirección',
            routerName: '/gerente-general/direccion',
            icon: 'mdi mdi-directions-fork'
          },
          {
            permissionName: 'Municipio',
            routerName: '/gerente-general/municipio',
            icon: 'mdi mdi-city'
          },
          {
            permissionName: 'Departamento',
            routerName: '/gerente-general/departamento',
            icon: 'mdi mdi-directions'
          },
          {
            permissionName: 'País',
            routerName: 'pais',
            icon: 'mdi mdi-directions'
          },
          {
            permissionName: 'Tipo Teléfono',
            routerName: '/gerente-general/tipo-telefono',
            icon: 'mdi mdi-phone-classic'
          },
          {
            permissionName: 'Teléfono',
            routerName: '/gerente-general/telefono',
            icon: 'mdi mdi-phone'
          },
          {
            permissionName: 'Persona',
            routerName: '/gerente-general/persona',
            icon: 'mdi mdi-account'
          },
          {
            permissionName: 'Tipo Persona',
            routerName: '/gerente-general/tipo-persona',
            icon: 'mdi mdi-account-alert'
          },
          {
            permissionName: 'Tipo Repuesto',
            routerName: '/gerente-general/tipo-repuesto',
            icon: 'mdi mdi-gauge'
          },
          {
            permissionName: 'Repuesto',
            routerName: '/gerente-general/repuesto',
            icon: 'mdi mdi-engine'
          },
          {
            permissionName: 'Equipo',
            routerName: '/gerente-general/equipo',
            icon: 'mdi mdi-server'
          },
          {
            permissionName: 'Servicio',
            routerName: '/gerente-general/servicio',
            icon: 'mdi mdi-server-network'
          }
        ]
        break;
      
      case "Trabajador Operacional":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: `/trabajador/home`,
            icon: 'mdi mdi-home-variant'
          },
          {
            permissionName: 'Repuesto',
            routerName: `/trabajador/repuesto`,
            icon: 'mdi mdi-engine'
          },
          {
            permissionName: 'Servicio',
            routerName: `/trabajador/servicio`,
            icon: 'mdi mdi-server-network'
          },
          {
            permissionName: 'Telefono',
            routerName: `/trabajador/telefono`,
            icon: 'mdi mdi-phone'
          }
        ]
        break;

      case "Cliente":
        return this.permissions = [
          {
            permissionName: 'Home',
            routerName: '/cliente/home',
            icon: 'mdi mdi-home-variant'
          },
          {
            permissionName: 'Equipo',
            routerName: '/cliente/equipo',
            icon: 'mdi mdi-server'
          },
          {
            permissionName: 'Servicio',
            routerName: '/cliente/servicio',
            icon: 'mdi mdi-server-network'
          },
          {
            permissionName: 'Telefono',
            routerName: '/cliente/telefono',
            icon: 'mdi mdi-phone'
          }
        ]
        break;
    }
  }

  navigate(permission: string) {
    return this.router.navigate([`${permission}`]);
  }
}
