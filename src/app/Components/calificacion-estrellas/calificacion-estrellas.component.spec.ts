import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalificacionEstrellasComponent } from './calificacion-estrellas.component';

describe('CalificacionEstrellasComponent', () => {
  let component: CalificacionEstrellasComponent;
  let fixture: ComponentFixture<CalificacionEstrellasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalificacionEstrellasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalificacionEstrellasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
