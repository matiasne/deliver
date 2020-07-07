import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormAgregarPedidoPage } from './form-agregar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: FormAgregarPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAgregarPedidoPageRoutingModule {}
