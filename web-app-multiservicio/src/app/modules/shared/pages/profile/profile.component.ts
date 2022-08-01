import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonaRelaciones, UpdatePersonaDTO } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  protected persona: PersonaRelaciones | null = null;
  protected idPersona: string | null = null;
  protected rol: string | null = null;
  protected loading = false;

  constructor(
    private personaService: PersonaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idPersona = localStorage.getItem('idPersona');
    this.rol = localStorage.getItem('rol');
    if (this.idPersona && this.rol) {
      this.getOnePerson(this.idPersona);
    } else {
      this.router.navigate(['/home']);
    }
    // this.loadData();
  }

  prueba(){
    let persona: UpdatePersonaDTO = {
      nombre: 'Juan Bernardo',
      apellidos: 'Sanchez Sotjo',
      dpi: '114587236-9'
    }
    this.updatePerson(persona)
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

  private loadData() {
    this.persona = {
      idPersona: 3,
      nombre: 'Pablo',
      apellidos: 'Martinez',
      correo: 'pablomartinez@email.com',
      dpi: '798413',
      Tipo_Persona: {
        idTipoPersona: 3,
        tipo: 'Gerente',
        Empresa: {
          idEmpresa: 4,
          nombre: 'Empresa 4',
          nit: '579831'
        }
      }
    }
  }
}
