import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CalificacionesService } from '../services/calificaciones.service';
import { Calificacion } from '../Models/calificacion';
import { NavController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PedidoService } from '../services/global/pedido.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-form-calificacion',
  templateUrl: './form-calificacion.page.html',
  styleUrls: ['./form-calificacion.page.scss'],
})
export class FormCalificacionPage implements OnInit {

 
  
  public calificacion:Calificacion;

  constructor(
    private calificacionesService:CalificacionesService,
    private navCtrl:NavController,
    private router:Router,
    private route:ActivatedRoute,
    private alertController:AlertController,
    private pedidoService:PedidoService,
    private auth:AuthService
  ){
    this.calificacion = new Calificacion();    
  }

  ngOnInit(){

  }

  guardar(){

    var pedido = this.pedidoService.pedidoCalificando;
    console.log(pedido)
    pedido.productos.forEach(producto =>{      
        this.calificacionesService.calificarProducto(pedido.comercioId, producto.id,this.calificacion.producto);
    });
    this.calificacionesService.calificarComercio(pedido.comercioId, this.calificacion.servicio);

    this.calificacion.comercioId = pedido.comercioId;
    this.calificacion.usuarioId = this.auth.getUID()

    this.calificacionesService.create(this.calificacion);
    this.presentAlert("Gracias por utilizar nuestra plataforma!");
   
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

  
  setVelocidad(newValue : any){
    this.calificacion.velocidad = newValue;
  }

  setProducto(newValue : any){
    this.calificacion.producto = newValue;
  }

  setServicio(newValue : any){
    this.calificacion.servicio = newValue;
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
