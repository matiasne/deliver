import { TestBed } from '@angular/core/testing';

import { FiltradoComercioService } from './filtrado-comercio.service';

describe('FiltradoComercioService', () => {
  let service: FiltradoComercioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltradoComercioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
