import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormAgregarPedidoPageRoutingModule } from './form-agregar-pedido-routing.module';

import { FormAgregarPedidoPage } from './form-agregar-pedido.page';
import { HeaderComponent } from '../Components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormAgregarPedidoPageRoutingModule
  ],
  declarations: [FormAgregarPedidoPage,HeaderComponent]
})
export class FormAgregarPedidoPageModule {}
