import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPedidoParticularPageRoutingModule } from './form-pedido-particular-routing.module';

import { FormPedidoParticularPage } from './form-pedido-particular.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    FormPedidoParticularPageRoutingModule
  ],
  declarations: [FormPedidoParticularPage]
})
export class FormPedidoParticularPageModule {}
