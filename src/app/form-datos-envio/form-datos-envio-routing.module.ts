import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormDatosEnvioPage } from './form-datos-envio.page';

const routes: Routes = [
  {
    path: '',
    component: FormDatosEnvioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormDatosEnvioPageRoutingModule {}
