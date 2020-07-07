import { TestBed } from '@angular/core/testing';

import { NotificacionesDesktopService } from './notificaciones-desktop.service';

describe('NotificacionesDesktopService', () => {
  let service: NotificacionesDesktopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesDesktopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
