import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsComercioPage } from './details-comercio.page';

describe('DetailsComercioPage', () => {
  let component: DetailsComercioPage;
  let fixture: ComponentFixture<DetailsComercioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsComercioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComercioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
