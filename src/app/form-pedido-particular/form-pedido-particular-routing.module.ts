import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormPedidoParticularPage } from './form-pedido-particular.page';

const routes: Routes = [
  {
    path: '',
    component: FormPedidoParticularPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormPedidoParticularPageRoutingModule {}
