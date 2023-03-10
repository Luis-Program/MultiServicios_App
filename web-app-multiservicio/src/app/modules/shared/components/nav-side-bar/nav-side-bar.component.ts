import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notificacion } from 'src/app/models/notificacion.model';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { getIdPersona, getRol } from '../../local-storage/localStorage';

declare function customInitFunctions(): any;

@Component({
  selector: 'app-nav-side-bar',
  templateUrl: './nav-side-bar.component.html',
  styleUrls: ['./nav-side-bar.component.css']
})
export class NavSideBarComponent implements OnInit {

  protected notificaciones: Notificacion[] = [];
  private idPersona: string | null = null;
  protected rol: string | null = null;
  protected loading = false;
  protected amountNotifications = 0;

  constructor(
    private router: Router,
    private notificacionService: NotificacionService
  ) { }

  ngOnInit(): void {
    customInitFunctions();
    this.getRolAndId();
  }

  private getRolAndId() {
    this.rol = getRol();
    this.idPersona = getIdPersona();
    if (this.rol && this.idPersona) {
      this.getNotificationsById(this.idPersona);
    } else {
      this.router.navigate(['/']);
    }
  }

  private getNotificationsById(idPersona: string) {
    this.loading = true;
    this.notificacionService.getAll(idPersona)
      .subscribe(notifications => {
        this.notificaciones = notifications;
        for (const noti of this.notificaciones) {
          if (!noti.visto) {
            this.amountNotifications += 1;
          }
        }
        this.loading = false;
      });
  }

  protected goByNotification(notification: Notificacion) {
    if (this.idPersona && this.rol) {
      switch (this.rol) {
        case 'Gerente General':
          this.goByNotificationManager(notification);
          break;
        case 'Cliente':
          this.goByNotificationClient(notification);
          break;
        case 'Trabajador Operacional':
          this.goByNotificationWorker(notification);
          break;
        default:
          break;
      }
    }
  }

  private goByNotificationManager(notification: Notificacion) {
    if (notification.idTipoNotificacion) {
      switch (notification.idTipoNotificacion) {
        // Repuesto Escaso
        case 1:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/repuesto']);
          break;
        // Nuevo Servicio Solicitado
        case 3:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/servicio']);
          break;
        // Asignaci??n de Trabajador
        case 4:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/servicio']);
          localStorage.setItem('servicio', 'update');
          break;
        // Activaci??n de Equipo
        case 6:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/equipo']);
          break;
        // Desactivaci??n de Equipo
        case 6:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/equipo']);
          break;
        // Servicio Finalizado
        case 7:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/servicio']);
          break;
        default:
          break;
      }
    }
  }

  private goByNotificationClient(notification: Notificacion) {
    if (notification.Tipo_Notificacion) {
      if (notification.idTipoNotificacion) {
        switch (notification.idTipoNotificacion) {
          // Servicio Finalizado
          case 7:
            localStorage.setItem('idNoti', String(notification.notificacionId));
            this.router.navigate(['cliente/servicio']);
            break;
          // Trabajador Asignado a su servicio
          case 8:
            localStorage.setItem('idNoti', String(notification.notificacionId));
            this.router.navigate(['cliente/servicio']);
            break;
          default:
            break;
        }
      }
    }
  }

  private goByNotificationWorker(notification: Notificacion) {
    if (notification.Tipo_Notificacion) {
      if (notification.idTipoNotificacion === 2) {
        localStorage.setItem('idNoti', String(notification.notificacionId));
        this.router.navigate(['trabajador/servicio']);
      }
    }
  }

  protected setAllRead() {
    if (this.idPersona) {
      this.notificacionService.setReadNotifications(this.idPersona)
        .subscribe(done => {
          if (done) {
            this.notificaciones = done;
            this.amountNotifications = 0;
          }
        });
    }
  }

  protected setOneRead(idNotificacion: string | number) {
    if (this.idPersona) {
      this.notificacionService.update(idNotificacion, { visto: true })
        .subscribe(notification => {
          if (notification) {
            const notificationIndex = this.notificaciones.findIndex(
              (res) => res.idNotificacion === idNotificacion);
            this.notificaciones[notificationIndex] = notification;
            this.amountNotifications--;
          }
        });
    }
  }

  protected deleteAll() {
    if (this.idPersona) {
      this.notificacionService.deleteAll(this.idPersona)
        .subscribe(done => {
          if (done) {
            this.notificaciones = [];
            this.amountNotifications = 0;
          }
        });
    }
  }

  protected deleteOne(idNotificacion: string | number) {
    this.notificacionService.delete(idNotificacion)
      .subscribe(resp => {
        if (resp) {
          const notificationIndex = this.notificaciones.findIndex(
            (res) => res.idNotificacion === idNotificacion);
          if (!this.notificaciones[notificationIndex].visto) {
            this.amountNotifications--;
          }
          this.notificaciones.splice(notificationIndex, 1);

        }
      });
  }

  // protected logout() {
  //   let route: string | null = null;
  //   if (this.rol) {
  //     switch (this.rol) {
  //       // case 'Gerente General':
  //       //   route = 'gerente-general/home';
  //       //   this.router.navigate(['gerente-general/home']);
  //       //   break;
  //       // case 'Trabajador Operacional':
  //       //   route = 'trabajador/home';
  //       //   this.router.navigate(['trabajador/home']);
  //       //   break;
  //       // case 'Cliente':
  //       //   route = 'cliente/home';
  //       //   this.router.navigate(['cliente/home']);
  //       //   break;
  //       // default:
  //       //   this.router.navigate(['home']);
  //       //   break;
  //       case 'Gerente General':
  //         console.log("Inside")
  //       route = '/home';
  //       this.router.navigate(['']);
  //       break;
  //     case 'Trabajador Operacional':
  //       route = '/home';
  //       this.router.navigate(['trabajador/home']);
  //       break;
  //     case 'Cliente':
  //       route = '/home';
  //       this.router.navigate(['cliente/home']);
  //       break;
  //     default:
  //       this.router.navigate(['/home']);
  //       break;
  //     }
  //   } else {
  //     this.router.navigate(['/home']);
  //   }
  //   if (route) {
  //     this.authB2C.setRoute(route);
  //     if (this.authB2C.getRoute()) {
  //       this.authB2C.logout();
  //     }
  //   }
  // }
}
