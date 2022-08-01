import { TestBed } from '@angular/core/testing';

import { TipoTelefonoService } from './tipo-telefono.service';

describe('TipoTelefonoService', () => {
  let service: TipoTelefonoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoTelefonoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
