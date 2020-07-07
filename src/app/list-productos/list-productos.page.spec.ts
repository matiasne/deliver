import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListProductosPage } from './list-productos.page';

describe('ListProductosPage', () => {
  let component: ListProductosPage;
  let fixture: ComponentFixture<ListProductosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
