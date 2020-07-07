import { TestBed } from '@angular/core/testing';

import { ComerciosService } from './comercios.service';

describe('ComerciosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComerciosService = TestBed.get(ComerciosService);
    expect(service).toBeTruthy();
  });
});
