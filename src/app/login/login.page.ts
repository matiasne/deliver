import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email:string;
  public password:string;
  public subscription: Subscription;

  constructor(
    private auth:AuthService,
    private router: Router,
    public platform:Platform,
    public loadingController: LoadingController,
  ) { 
    this.email ="";
    this.password ="";

  }

  ngOnInit() {
    
  }

  login(){  
    this.presentLoading(); 
    this.auth.login(this.email.trim(),this.password.trim()); 
    
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


  loginWithGoogle() {
    this.presentLoading(); 
    if(this.auth.googleSignin()){
      
    }

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

  showRegistro(){
    this.router.navigate(['/registro']);
  }

  showRecuperar(){
    this.router.navigate(['/recuperacion']);
  }

  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
  } 


  ionViewDidLeave(){
      this.subscription.unsubscribe();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Aguarde por favor...',
      duration: 5000
    });
    await loading.present();
  }


  hideLoading(){
    this.loadingController.dismiss();
  }

  

}
