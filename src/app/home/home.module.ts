import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { HeaderComponent } from '../Components/header/header.component';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [   
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage
  ]
})
export class HomePageModule {}
