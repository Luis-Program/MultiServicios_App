import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthB2cService } from 'src/app/services/auth-b2c.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { PersonaRelaciones, UpdatePersonaDTO } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  protected persona: PersonaRelaciones | null = null;
  protected idPersona: string | null = null;
  protected rol: string | null = null;
  protected loading = false;

  constructor(
    private router: Router,
    private authB2C: AuthB2cService,
    private notificacionService: NotificacionService,
    private personaService: PersonaService,
  ) { }

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
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
    switch(this.rol) {
      case "Gerente General"        : return this.router.navigate(['/gerente-general/perfil']);
      case "Trabajador Operacional" : return this.router.navigate(['/trabajador/perfil']);
      case "Cliente"                : return this.router.navigate(['/cliente/perfil']);
    }
  }
}
