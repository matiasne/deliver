import { TestBed } from '@angular/core/testing';

import { CategoriasGeneralService } from './categorias-general.service';

describe('CategoriasGeneralService', () => {
  let service: CategoriasGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriasGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
