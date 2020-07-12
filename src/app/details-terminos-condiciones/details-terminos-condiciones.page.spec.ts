import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsTerminosCondicionesPage } from './details-terminos-condiciones.page';

describe('DetailsTerminosCondicionesPage', () => {
  let component: DetailsTerminosCondicionesPage;
  let fixture: ComponentFixture<DetailsTerminosCondicionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTerminosCondicionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsTerminosCondicionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
