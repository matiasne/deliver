import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormDatosEnvioPageRoutingModule } from './form-datos-envio-routing.module';

import { FormDatosEnvioPage } from './form-datos-envio.page';
import { FormDatosUsuarioComponent } from '../Components/form-datos-usuario/form-datos-usuario.component';
import { HeaderComponent } from '../Components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormDatosEnvioPageRoutingModule
  ],
  declarations: [FormDatosEnvioPage,FormDatosUsuarioComponent,HeaderComponent]
})
export class FormDatosEnvioPageModule {}
