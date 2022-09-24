import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonaRelacionesLogin, UpdatePersonaDTO } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { getIdPersona, getRol } from '../../local-storage/localStorage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  protected persona: PersonaRelacionesLogin | null = null;
  protected idPersona: string | null = null;
  protected rol: string | null = null;
  protected loading !: boolean;

  public Form!: FormGroup;

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.idPersona = getIdPersona();
    this.rol = getRol();
    if (this.idPersona && this.rol) {
      this.getOnePerson(this.idPersona);
      this.loading = false;
    } else {
      this.router.navigate(['/home']);
    }
  }

  private getOnePerson(idPersona: number | string) {
    this.personaService.getOne(idPersona)
      .subscribe(person => {
        this.persona = person;
        this.initForm(person);
      });
  }

  protected updatePerson(dto: UpdatePersonaDTO) {
    if (this.idPersona) {
      this.personaService.update(this.idPersona, dto)
        .subscribe(res => {
          if (res) {
            this.persona = res;
            Swal.fire({
              icon  :  "success",
              title :  "Actualizado",
              text  :  "Perfil actualizado"
            })
          }
        });
    }
  }

  protected initForm(persona: PersonaRelacionesLogin) {
    this.Form = this.formBuilder.group({
      idPersona : [persona.idPersona],
      nombre    : [persona.nombre,    [Validators.required, Validators.maxLength(25)]],
      apellidos : [persona.apellidos, [Validators.required, Validators.maxLength(25)]],
      correo    : [persona.correo,    [Validators.required, Validators.email]],
      dpi       : [persona.dpi,       [Validators.required, Validators.maxLength(13), Validators.minLength(13)]]
    })
  }

  protected get nombre() {
    return this.Form.get('nombre');
  }

  protected get apellidos() {
    return this.Form.get('apellidos');
  }

  protected get dpi() {
    return this.Form.get('dpi');
  }

  protected updateUser() {
    if (this.Form.invalid) return Object.values(this.Form.controls).forEach(c => c.markAsTouched());
    const { idPersona, ...rest } = this.Form.value;
    this.updatePerson(rest);
  }


}
