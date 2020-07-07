import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormPedidoCadetePage } from './form-pedido-cadete.page';

describe('FormPedidoCadetePage', () => {
  let component: FormPedidoCadetePage;
  let fixture: ComponentFixture<FormPedidoCadetePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPedidoCadetePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormPedidoCadetePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
