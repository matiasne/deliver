import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsTerminosCondicionesPage } from './details-terminos-condiciones.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsTerminosCondicionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsTerminosCondicionesPageRoutingModule {}
