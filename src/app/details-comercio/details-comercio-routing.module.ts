import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsComercioPage } from './details-comercio.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsComercioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsComercioPageRoutingModule {}
