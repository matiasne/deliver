import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormPedidoCadetePage } from './form-pedido-cadete.page';

const routes: Routes = [
  {
    path: '',
    component: FormPedidoCadetePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormPedidoCadetePageRoutingModule {}
