import { Component, OnInit } from '@angular/core';
declare var google: any;
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { UserData } from '../Models/userData';

@Component({
  selector: 'app-form-mis-datos',
  templateUrl: './form-mis-datos.page.html',
  styleUrls: ['./form-mis-datos.page.scss'],
})
export class FormMisDatosPage implements OnInit {
 
  private user:UserData;

  constructor(
   private authService:AuthService,
   private navCtrl: NavController,
   private router:Router
  ) { 

  }
  
  ngOnInit(){
    
  }

  setValue(newValue : any){
    console.log(newValue);
    this.user = newValue;
  }

  cancelar(){
    if(localStorage.getItem('comercioUnico')){
      this.router.navigate(['/details-comercio',{
        id:localStorage.getItem('comercioUnicoId'),
        enLocal:localStorage.getItem('enLocal'),
        comercioUnico:localStorage.getItem('comercioUnico'),
      }]);
    }
    else{
      this.router.navigate(['/home']);
    }
  }

  guardar(){
    this.authService.updateLocalUserData(this.user);
    if(localStorage.getItem('comercioUnico')){
      this.router.navigate(['/details-comercio',{
        id:localStorage.getItem('comercioUnicoId'),
        enLocal:localStorage.getItem('enLocal'),
        comercioUnico:localStorage.getItem('comercioUnico'),
      }]);
    }
    else{
      this.router.navigate(['/home']);
    }
  }
}
