import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormDatosEnvioPage } from './form-datos-envio.page';

describe('FormDatosEnvioPage', () => {
  let component: FormDatosEnvioPage;
  let fixture: ComponentFixture<FormDatosEnvioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDatosEnvioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormDatosEnvioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
