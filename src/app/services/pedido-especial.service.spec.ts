import { TestBed } from '@angular/core/testing';

import { PedidoEspecialService } from './pedido-especial.service';

describe('PedidoEspecialService', () => {
  let service: PedidoEspecialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoEspecialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
