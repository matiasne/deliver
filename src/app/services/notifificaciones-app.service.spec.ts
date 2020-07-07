import { TestBed } from '@angular/core/testing';

import { NotifificacionesAppService } from './notifificaciones-app.service';

describe('NotifificacionesAppService', () => {
  let service: NotifificacionesAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifificacionesAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
