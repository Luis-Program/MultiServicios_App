import { TestBed } from '@angular/core/testing';

import { AnalisisRepuestoService } from './analisis-repuesto.service';

describe('AnalisisRepuestoService', () => {
  let service: AnalisisRepuestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalisisRepuestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
