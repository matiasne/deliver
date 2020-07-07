import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsComercioPageRoutingModule } from './details-comercio-routing.module';

import { DetailsComercioPage } from './details-comercio.page';
import { HeaderComponent } from '../Components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsComercioPageRoutingModule
  ],
  declarations: [DetailsComercioPage,HeaderComponent]
})
export class DetailsComercioPageModule {}
