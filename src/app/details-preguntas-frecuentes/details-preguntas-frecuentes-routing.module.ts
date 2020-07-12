import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsPreguntasFrecuentesPage } from './details-preguntas-frecuentes.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsPreguntasFrecuentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsPreguntasFrecuentesPageRoutingModule {}
