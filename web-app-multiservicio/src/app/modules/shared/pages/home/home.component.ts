import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getRol } from '../../local-storage/localStorage';
import { IPermissions } from '../Intefaces/IPermissions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected rol: string | null = null;

  protected permissions!: IPermissions[];
  protected loader!: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loader = true;
    this.getRol();
  }

  protected getRol(): any {
    this.rol = getRol();
    if (!this.rol) {
      return this.router.navigate(['/home']);
    }else{
      this.getPermissions(this.rol!);
      this.loader = false;
    }
  }

  protected getPermissions(rol: string): any {

    switch(rol) {
      case "Gerente General":
        return this.permissions = [
          {
            permissionName: 'Auditoria Servicio',
            routerName: '/gerente-general/auditoria-servicio',
            icon: 'mdi mdi-file-find'
          },
          {
            permissionName: 'Análisis Repuesto',
            routerName: '/gerente-general/analisis-repuesto',
            icon: 'mdi mdi-chart-areaspline'
          },
          {
            permissionName: 'Empresa',
            routerName: '/gerente-general/empresa',
            icon: 'mdi mdi-factory'
          },
          {
            permissionName: 'Dirección',
            routerName: '/gerente-general/direccion',
            icon: 'mdi mdi-map-marker'
          },
          {
            permissionName: 'Municipio',
            routerName: '/gerente-general/municipio',
            icon: 'mdi mdi-bank'
          },
          {
            permissionName: 'Departamento',
            routerName: '/gerente-general/departamento',
            icon: 'mdi mdi-domain'
          },
          {
            permissionName: 'País',
            routerName: '/gerente-general/pais',
            icon: 'mdi mdi-flag'
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
            permissionName: 'Rol',
            routerName: '/gerente-general/tipo-persona',
            icon: 'mdi mdi-account-multiple'
          },
          {
            permissionName: 'Tipo Repuesto',
            routerName: '/gerente-general/tipo-repuesto',
            icon: 'mdi mdi-tag-multiple'
          },
          {
            permissionName: 'Repuesto',
            routerName: '/gerente-general/repuesto',
            icon: 'mdi mdi-engine'
          },
          {
            permissionName: 'Equipo',
            routerName: '/gerente-general/equipo',
            icon: 'mdi mdi-stove'
          },
          {
            permissionName: 'Servicio',
            routerName: '/gerente-general/servicio',
            icon: 'mdi mdi-wrench'
          }
        ]
        break;

      case "Trabajador Operacional":
        return this.permissions = [
          {
            permissionName: 'Repuesto',
            routerName: `/trabajador/repuesto`,
            icon: 'mdi mdi-engine'
          },
          {
            permissionName: 'Servicio',
            routerName: `/trabajador/servicio`,
            icon: 'mdi mdi-wrench'
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
            permissionName: 'Equipo',
            routerName: '/cliente/equipo',
            icon: 'mdi mdi-stove'
          },
          {
            permissionName: 'Servicio',
            routerName: '/cliente/servicio',
            icon: 'mdi mdi-wrench'
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

  protected navigate(permission: string) {
    return this.router.navigate([`${permission}`]);
  }
}
