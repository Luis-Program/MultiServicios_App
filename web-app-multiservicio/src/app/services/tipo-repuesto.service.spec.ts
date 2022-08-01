import { TestBed } from '@angular/core/testing';

import { TipoRepuestoService } from './tipo-repuesto.service';

describe('TipoRepuestoService', () => {
  let service: TipoRepuestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoRepuestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
