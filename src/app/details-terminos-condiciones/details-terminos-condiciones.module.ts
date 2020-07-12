import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsTerminosCondicionesPageRoutingModule } from './details-terminos-condiciones-routing.module';

import { DetailsTerminosCondicionesPage } from './details-terminos-condiciones.page';
import { HeaderComponent } from '../Components/header/header.component';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DetailsTerminosCondicionesPageRoutingModule
  ],
  declarations: [DetailsTerminosCondicionesPage]
})
export class DetailsTerminosCondicionesPageModule {}
