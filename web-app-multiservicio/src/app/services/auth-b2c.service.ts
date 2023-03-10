import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { clearData } from '../modules/shared/local-storage/localStorage';
import { b2cPolicies, msalConfig } from './../azure-b2c-config/auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthB2cService {
  isIframe = false;
  loginDisplay = false;
  // protected route: string | null = null;
  readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router:Router
  ) { }

  public startB2c() {
    this.isIframe = window !== window.parent && !window.opener;
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  public checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  public setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  public login(userFlowRequest?: RedirectRequest) {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect(userFlowRequest);
    }
  }

  // public setRoute(route: string) {
  //   if (route) {
  //     this.route = route;
  //     // console.log(this.route)
  //   }
  // }

  // public getRoute() {
  //   return this.route;
  // }

  public logout() {
    localStorage.removeItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:r-t5rwz9-1fa3-mna-10");
    localStorage.removeItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:i-t5rwz9-1fa3-mna-10");
    this.authService.instance.setActiveAccount(this.authService.instance.getAllAccounts()[0]); // If you have not set an active account, you may need to set one
    const request = {
      redirectStartPage: msalConfig.auth.redirectUri,
      scopes: ["openid", "profile",] // This is added to address issue raised in #3530
    };
    this.authService.acquireTokenSilent(request as SilentRequest).subscribe({
      next: (result: AuthenticationResult) => {
        this.authService.logoutRedirect({ idTokenHint: result.idToken });
        localStorage.clear();
      },
      error: (error) => {
        // Do something with error here
        console.log(error)
      }
    });
  }

  public resetPassword() {
    let resetPasswordFlowRequest = {
      scopes: ["openid"],
      authority: b2cPolicies.authorities.resetPassword.authority,
    };
    this.login(resetPasswordFlowRequest);
  }

  public destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
