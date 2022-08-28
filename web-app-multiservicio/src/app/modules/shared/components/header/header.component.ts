import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthB2cService } from 'src/app/services/auth-b2c.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { PersonaRelaciones, UpdatePersonaDTO } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { Notificacion } from 'src/app/models/notificacion.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  protected notificaciones: Notificacion[] = [];
  protected persona: PersonaRelaciones | null = null;
  protected idPersona: string | null = null;
  protected rol: string | null = null;
  protected loading = false;

  public isToggle: EventEmitter<boolean> = new EventEmitter(true);
  public toggleState: boolean = true;

  constructor(
    private router: Router,
    private authB2C: AuthB2cService,
    private notificacionService: NotificacionService,
    private personaService: PersonaService,
  ) { }

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    this.getNotificationsById(this.idPersona!);
    this.rol = localStorage.getItem('rol');
    if (this.idPersona && this.rol) {
      this.getOnePerson(this.idPersona);
    } else {
      this.router.navigate(['/home']);
    }
  }

  protected logout() {
    this.authB2C.logout();
  }

  private getOnePerson(idPersona: number | string) {
    this.personaService.getOne(idPersona)
      .subscribe(person => {
        this.persona = person;
      });
  }

  protected updatePerson(dto: UpdatePersonaDTO) {
    if (this.idPersona) {
      this.loading = true;
      this.personaService.update(this.idPersona, dto)
        .subscribe(res => {
          if (res) {
            this.persona = res;
            // Success
          }
          this.loading = false;
        });
    }
  }

  navigateToProfile(): any {
    switch (this.rol) {
      case "Gerente General": return this.router.navigate(['/gerente-general/perfil']);
      case "Trabajador Operacional": return this.router.navigate(['/trabajador/perfil']);
      case "Cliente": return this.router.navigate(['/cliente/perfil']);
    }
  }

  // NOTIFICATIONS

  private getNotificationsById(idPersona: string) {
    this.loading = true;
    this.notificacionService.getAll(idPersona)
      .subscribe(notifications => {
        this.notificaciones = notifications;

        this.loading = false;
      });
  }

  protected goByNotification(notification: Notificacion) {
    if (this.idPersona && this.rol) {
      if (!notification.visto) {
        this.setOneRead(notification.idNotificacion);
      }
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
        // Asignación de Trabajador
        case 4:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/servicio']);
          break;
        // Activación de Equipo
        case 5:
          localStorage.setItem('idNoti', String(notification.notificacionId));
          this.router.navigate(['gerente-general/equipo']);
          break;
        // Desactivación de Equipo
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
        localStorage.setItem('idNoti', String(notification.notificacionId));
        this.router.navigate(['cliente/servicio']);
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
          this.notificaciones.splice(notificationIndex, 1);
        }
      });
  }

  showNotificationDetail(notification: Notificacion) {

    this.setOneRead(notification.idNotificacion);

    Swal.fire({
      'title': "Notificación",
      'text': notification.textoNotificacion,
      'focusConfirm': true
    })

    return this.getNotificationsById(this.idPersona!)
  }

  toggleNavbar() {
    (this.toggleState) ? this.toggleState = false : this.toggleState = true;

    return this.isToggle.emit(this.toggleState);
  }
}
