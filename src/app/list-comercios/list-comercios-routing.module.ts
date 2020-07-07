import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComerciosPage } from './list-comercios.page';

const routes: Routes = [
  {
    path: '',
    component: ListComerciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListComerciosPageRoutingModule {}
