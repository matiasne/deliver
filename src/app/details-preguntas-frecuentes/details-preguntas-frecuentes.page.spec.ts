import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsPreguntasFrecuentesPage } from './details-preguntas-frecuentes.page';

describe('DetailsPreguntasFrecuentesPage', () => {
  let component: DetailsPreguntasFrecuentesPage;
  let fixture: ComponentFixture<DetailsPreguntasFrecuentesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPreguntasFrecuentesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPreguntasFrecuentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
