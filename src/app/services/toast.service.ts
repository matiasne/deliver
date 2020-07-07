import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async mensaje(titulo,mensaje) {


    const toast = await this.toastController.create({
      header: titulo,
      message: mensaje,
      position: 'top',
      color: "primary",
      duration: 5000,
      buttons: [
       {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async alert(titulo,mensaje){  
    
    const toast = await this.toastController.create({
      header: titulo,
      message: mensaje,
      position: 'top',
      color: "danger",
      duration: 5000,
      buttons: [
       {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();

  }

  async mensajeVerde(titulo,mensaje){
   
    const toast = await this.toastController.create({
      header: titulo,
      message: mensaje,
      position: 'top',
      color: "success",
      duration: 5000,
      buttons: [
       {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();

  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: 'top',
      buttons: [
       {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    
  }
  


}
