import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsMisPedidosPageRoutingModule } from './details-mis-pedidos-routing.module';

import { DetailsMisPedidosPage } from './details-mis-pedidos.page';
import { HeaderComponent } from '../Components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsMisPedidosPageRoutingModule
  ],
  declarations: [DetailsMisPedidosPage,HeaderComponent]
})
export class DetailsMisPedidosPageModule {}
