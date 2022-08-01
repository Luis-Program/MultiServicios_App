import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTelefonoComponent } from './tipo-telefono.component';

describe('TipoTelefonoComponent', () => {
  let component: TipoTelefonoComponent;
  let fixture: ComponentFixture<TipoTelefonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoTelefonoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoTelefonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
