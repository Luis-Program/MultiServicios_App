import { TestBed } from '@angular/core/testing';

import { AuditoriaServicioService } from './auditoria-servicio.service';

describe('AuditoriaServicioService', () => {
  let service: AuditoriaServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditoriaServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
