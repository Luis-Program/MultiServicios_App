import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthB2cService } from 'src/app/services/auth-b2c.service';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { TipoPersonaRelaciones } from 'src/app/models/tipo_persona.model';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private readonly _destroyingClaims$ = new Subject<void>();
  protected loggedIn = false;
  protected serviceInfo = false;

  constructor(
    private router: Router,
    private authB2C: AuthB2cService,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroyingClaims$)
      )
      .subscribe((result: EventMessage) => {

        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
        this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims)
      });
  }

  protected checkLogin() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      this.setRedirectByRol(rol);
    }
  }

  protected login() {
    this.authB2C.login();
  }

  private setRedirectByRol(rol: String) {
    if (rol) {
      switch (rol) {
        case 'Gerente General':
          this.router.navigate(['gerente-general']);
          break;
        case 'Trabajador Operacional':
          this.router.navigate(['trabajador']);
          break;
        case 'Cliente':
          this.router.navigate(['cliente']);
          break;
        default:
          this.router.navigate(['error']);
          break;
      }
    }
  }

  // Claims
  private checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  private getClaims(claims: any) {
    let email = claims ? claims['emails'] : null;
    if (email) {
      this.personaService.getOneByEmail(email)
        .subscribe(data => {
          localStorage.setItem('idPersona', data.idPersona.toString());
          const tipopersona: TipoPersonaRelaciones | null = data.Tipo_Persona;
          if (tipopersona) {
            localStorage.setItem('rol', tipopersona.tipo);
            this.serviceInfo = true;
          } else {
            this.serviceInfo = true;
            this.authB2C.logout();
          }
        });
    } else {
      localStorage.clear();
      this.loggedIn = true;
    }
  }

  protected resetPassword() {
    this.authB2C.resetPassword();
  }

  ngOnDestroy(): void {
    this._destroyingClaims$.next(undefined);
    this._destroyingClaims$.complete();
  }
}
