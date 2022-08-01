import { TestBed } from '@angular/core/testing';

import { AuthB2cService } from './auth-b2c.service';

describe('AuthB2cService', () => {
  let service: AuthB2cService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthB2cService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
