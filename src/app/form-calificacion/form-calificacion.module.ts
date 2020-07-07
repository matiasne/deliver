import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCalificacionPageRoutingModule } from './form-calificacion-routing.module';

import { FormCalificacionPage } from './form-calificacion.page';
import { InputCalificacionComponent } from '../Components/input-calificacion/input-calificacion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormCalificacionPageRoutingModule
  ],
  declarations: [FormCalificacionPage,InputCalificacionComponent]
})
export class FormCalificacionPageModule {}
