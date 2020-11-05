import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../services/global/pedido.service';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserData } from '../Models/userData';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { Pedido } from '../Models/pedido';
import { UsuariosService } from '../services/usuarios.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-form-datos-envio',
  templateUrl: './form-datos-envio.page.html',
  styleUrls: ['./form-datos-envio.page.scss'],
})
export class FormDatosEnvioPage implements OnInit {

 
  public pedidoActual:Pedido;
  private user:UserData;

  private calcularDistancia = true;

  private distancia = 0;

  private userSubs:Subscription;

  constructor(
   private authService:AuthService,
   private navCtrl: NavController,
   private pedidoService:PedidoService,
   private router:Router,
   private alertController:AlertController
  ) { 
    this.user = new UserData();
  }

  ngOnInit() {  

    this.userSubs = this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
      if(this.pedidoActual.ordenes.length > 1){
        this.calcularDistancia = false;
      }
     // if(this.pedidoActual.pedidos)
    });


  }

  ionViewDidLeave(){
    this.userSubs.unsubscribe();
  }

  setValue(newValue : any){    
    this.user.asignarValores(newValue);
    console.log(this.user)
    console.log(this.user.posicion); //Esta bien!!!
    if(this.calcularDistancia){
      this.setDistancia(this.pedidoActual.ordenes[0].comercioPosicion,this.user);
    }
  }

  setDistancia(posiscionComercio,user){
    console.log(posiscionComercio)
    console.log(user.posicion)
    const geo = geofirex.init(firebase);
    if(posiscionComercio.geopoint.Latitude !=""){
      this.distancia = Number(geo.distance(geo.point(user.posicion.geopoint.Latitude, user.posicion.geopoint.Longitude), geo.point(posiscionComercio.geopoint.Latitude, posiscionComercio.geopoint.Longitude)).toFixed(2))
      console.log("distancia: ")
      console.log(this.distancia);
      if(this.distancia > 0 && this.distancia <= 1.6) {
        console.log(70)
        this.pedidoService.setCostoEnvio(70);
      }  
      if(this.distancia > 1.6 && this.distancia <= 2) {
        console.log(80)
        this.pedidoService.setCostoEnvio(80);
      }  
      if(this.distancia > 2 && this.distancia <= 3) {
        console.log(90)
        this.pedidoService.setCostoEnvio(90);
      }  
      if(this.distancia > 3 && this.distancia <= 4) {
        console.log(110)
        this.pedidoService.setCostoEnvio(110);
      }  
      if(this.distancia > 4 && this.distancia <= 5) {
        console.log(140)
        this.pedidoService.setCostoEnvio(140);
      }  
      
      if(this.distancia > 4){
        console.log(200)
        this.pedidoService.setCostoEnvio(200);
      }
    }
  }


  cancelar(){
    this.navCtrl.back();
  }

  guardar(){

    console.log(this.user.direccion);

    if(this.user.telefono == ""){
      alert("Por favor ingrese un teléfono antes de continuar");
      return;
    }

    if(this.user.direccion == ""){
      alert("Por favor ingrese una dirección antes de continuar");
      return;
    }

    if(this.user.displayName == ""){
      alert("Por favor ingrese un nombre antes de continuar");
      return;
    }


    this.pedidoService.setClienteNombre(this.user.displayName);
    this.pedidoService.setPosition(this.user.posicion);
    this.pedidoService.setDireccion(this.user.direccion);
    this.pedidoService.setPiso(this.user.address.piso);
    this.pedidoService.setPuerta(this.user.address.puerta);
    this.pedidoService.setClienteTelefono(this.user.telefono);

    this.pedidoService.save();
    
    if(this.authService.isAuthenticated())
        this.presentAlert("Su pedido está en curso! Mira el panel 'Mis Pedidos' para ver el estado del mismo");
      else
        this.presentAlert("Recuerda Loguearte para poder hacer un seguimiento de tus pedidos!");
    
        
        
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


  async presentAlert(message) {

    const alert = await this.alertController.create({
      header: 'Gracias!!',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


}
