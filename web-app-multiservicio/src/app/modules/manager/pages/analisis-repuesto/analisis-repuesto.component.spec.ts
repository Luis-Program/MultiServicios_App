import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisRepuestoComponent } from './analisis-repuesto.component';

describe('AnalisisRepuestoComponent', () => {
  let component: AnalisisRepuestoComponent;
  let fixture: ComponentFixture<AnalisisRepuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisisRepuestoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalisisRepuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
