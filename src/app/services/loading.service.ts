import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;
  
  constructor(
    public loadingController: LoadingController,
  ) { }

  async presentLoading() {    
    if(!this.isLoading){
      this.isLoading = true;
      return await this.loadingController.create({
        message: 'Cargando',
      }).then(a => {
        a.present().then(() => {
          
          if (!this.isLoading) {
            a.dismiss().then(() => {
              
            });
          }

         
          setTimeout(()=> {
            this.dismissLoading()
          }, 10000);

        });
      });
    }    
  }

  async dismissLoading() {
    if(this.isLoading){
      this.isLoading = false;
      return await this.loadingController.dismiss().then(() => {
        
      });
    }
  }

}
