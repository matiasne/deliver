import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPedidoCadetePageRoutingModule } from './form-pedido-cadete-routing.module';

import { FormPedidoCadetePage } from './form-pedido-cadete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormPedidoCadetePageRoutingModule
  ],
  declarations: [FormPedidoCadetePage]
})
export class FormPedidoCadetePageModule {}
