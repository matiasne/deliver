import { TestBed } from '@angular/core/testing';

import { GrupoOpcionesService } from './grupo-opciones.service';

describe('GrupoOpcionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrupoOpcionesService = TestBed.get(GrupoOpcionesService);
    expect(service).toBeTruthy();
  });
});
