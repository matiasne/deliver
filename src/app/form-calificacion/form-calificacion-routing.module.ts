import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCalificacionPage } from './form-calificacion.page';

const routes: Routes = [
  {
    path: '',
    component: FormCalificacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCalificacionPageRoutingModule {}
