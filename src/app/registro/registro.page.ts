import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public email:String;
  public contrasena:String;
  public contrasenaConfirm:String;

  constructor(
    private router: Router,
    private auth:AuthService,    
    public toastController: ToastController, 
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.email ="";
    this.contrasena ="";
    this.contrasenaConfirm ="";
  }

  showLogin(){
    this.router.navigate(['/login']);
  }

  showRecuperar(){
    this.router.navigate(['/recuperacion']);
  }

  signup(){
    this.presentLoading();
    if(this.email==""){
      this.alertToast('Ingrese un mail');
      return false;
    }

    if(this.contrasena==""){
      this.alertToast('Ingrese una contraseña');     
      return false;
    }
        
    if(this.contrasena != this.contrasenaConfirm){
      this.alertToast('Las contraseñas no coinciden');      
      return false;
    } 
    this.auth.signup(this.email.trim(),this.contrasena.trim());    
  }

  async alertToast(message) {

    console.log("!!!!!!")
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: "danger"
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Aguarde por favor...',
      duration: 5000
    });
    await loading.present();
  }
}
