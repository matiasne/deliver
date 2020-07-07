import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCalificacionPage } from './form-calificacion.page';

describe('FormCalificacionPage', () => {
  let component: FormCalificacionPage;
  let fixture: ComponentFixture<FormCalificacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCalificacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCalificacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
