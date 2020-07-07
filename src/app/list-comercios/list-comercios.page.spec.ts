import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListComerciosPage } from './list-comercios.page';

describe('ListComerciosPage', () => {
  let component: ListComerciosPage;
  let fixture: ComponentFixture<ListComerciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComerciosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComerciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
