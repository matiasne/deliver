import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormPedidoParticularPage } from './form-pedido-particular.page';

describe('FormPedidoParticularPage', () => {
  let component: FormPedidoParticularPage;
  let fixture: ComponentFixture<FormPedidoParticularPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPedidoParticularPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormPedidoParticularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
