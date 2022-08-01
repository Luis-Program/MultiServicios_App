import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPersonaComponent } from './tipo-persona.component';

describe('TipoPersonaComponent', () => {
  let component: TipoPersonaComponent;
  let fixture: ComponentFixture<TipoPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
