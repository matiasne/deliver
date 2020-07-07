import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsMisPedidosPage } from './details-mis-pedidos.page';

describe('DetailsMisPedidosPage', () => {
  let component: DetailsMisPedidosPage;
  let fixture: ComponentFixture<DetailsMisPedidosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsMisPedidosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsMisPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
