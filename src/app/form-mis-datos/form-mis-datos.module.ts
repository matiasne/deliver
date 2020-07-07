import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormMisDatosPageRoutingModule } from './form-mis-datos-routing.module';

import { FormMisDatosPage } from './form-mis-datos.page';
import { FormDatosUsuarioComponent } from '../Components/form-datos-usuario/form-datos-usuario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormMisDatosPageRoutingModule
  ],
  declarations: [FormMisDatosPage,FormDatosUsuarioComponent]
})
export class FormMisDatosPageModule {}
