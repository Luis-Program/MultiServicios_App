import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaServicioComponent } from './auditoria-servicio.component';

describe('AuditoriaServicioComponent', () => {
  let component: AuditoriaServicioComponent;
  let fixture: ComponentFixture<AuditoriaServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaServicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
