import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormMisDatosPage } from './form-mis-datos.page';

const routes: Routes = [
  {
    path: '',
    component: FormMisDatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormMisDatosPageRoutingModule {}
