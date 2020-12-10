import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { Pedido } from '../Models/pedido';
import { PedidoService } from '../services/global/pedido.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  public pedidoActual:Pedido;
  constructor(
    public modalController: ModalController,
    private router: Router,
    private pedidoService:PedidoService,
    public alertController: AlertController,
    private navCtrl: NavController,
    private authService:AuthService,
    private toastService:ToastService
  ) { }

  ngOnInit() {
    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    })
  }

  confirmar(){

    let enLocal = localStorage.getItem('enLocal');

    
      
    this.pedidoService.save();


    if(this.authService.isAuthenticated())
        this.presentAlert("Su pedido está en curso! Mira el panel 'Mis Pedidos' para ver el estado del mismo");
      else
        this.presentAlert("Recuerda Loguearte para poder hacer un seguimiento de tus pedidos!");
    
        
        
    this.router.navigate(['/home']);
        
      
      
      
     
     
    

    

    
  }

  cancelar(){
    this.navCtrl.back();
  }
 

  async eliminarOrden(c,p) {
    
    const alert = await this.alertController.create({
      header: 'Esta seguro?',
      message: 'Eliminar producto del pedido?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => { 
            this.pedidoService.deleteOrden(c,p);
            if(this.pedidoActual.cantidadTotal == 0)
              this.navCtrl.back();
          }
        }
      ]
    });

    await alert.present();
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
