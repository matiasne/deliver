import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListComerciosPageRoutingModule } from './list-comercios-routing.module';

import { ListComerciosPage } from './list-comercios.page';
import { CalificacionEstrellasComponent } from '../Components/calificacion-estrellas/calificacion-estrellas.component';
import { HeaderComponent } from '../Components/header/header.component';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ListComerciosPageRoutingModule
  ],
  declarations: [
    ListComerciosPage,
    CalificacionEstrellasComponent
  ]
})
export class ListComerciosPageModule {}
