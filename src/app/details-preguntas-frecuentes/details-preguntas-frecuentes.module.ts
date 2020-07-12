import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPreguntasFrecuentesPageRoutingModule } from './details-preguntas-frecuentes-routing.module';

import { DetailsPreguntasFrecuentesPage } from './details-preguntas-frecuentes.page';
import { HeaderComponent } from '../Components/header/header.component';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DetailsPreguntasFrecuentesPageRoutingModule
  ],
  declarations: [DetailsPreguntasFrecuentesPage]
})
export class DetailsPreguntasFrecuentesPageModule {}
