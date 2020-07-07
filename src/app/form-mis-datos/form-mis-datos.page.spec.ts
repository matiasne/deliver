import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormMisDatosPage } from './form-mis-datos.page';

describe('FormMisDatosPage', () => {
  let component: FormMisDatosPage;
  let fixture: ComponentFixture<FormMisDatosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMisDatosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormMisDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
