import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { Pedido } from '../Models/pedido';
import { PedidoService } from '../services/global/pedido.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../services/comercios.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-details-mis-pedidos',
  templateUrl: './details-mis-pedidos.page.html',
  styleUrls: ['./details-mis-pedidos.page.scss'],
})
export class DetailsMisPedidosPage implements OnInit {

 
  public pedidos;
  public pedidosATomar;
  public pedidosCadeteria;
  public commerce_id;

  public commerceSubscription:Subscription;
  public subsPedidos:Subscription;
  public subsPedidosComercio:Subscription;

  constructor(
    public modalController: ModalController,
    private router: Router,
    private pedidoService:PedidoService,
    public alertController: AlertController,
    private localNotifications: LocalNotifications,
    private _comerciosService:ComerciosService,
    private alertCtrl: AlertController,
    private auth:AuthService
  ) { 
    this.pedidos = [];
  }

  ngOnInit() {

    //Usuario clásico: solo los pedidos de ese usuario
    this.subsPedidos = this.pedidoService.getPedidosCliente().subscribe((snapshot) => {
      this.pedidos = [];      
      snapshot.forEach((snap: any) => {
        let pedido:any = snap.payload.doc.data();
        pedido.id = snap.payload.doc.id; 
        pedido.createdAt = new Date(pedido.createdAt.seconds)  
        pedido.verRol = "cliente";
        this.pedidos.push(pedido);  
      });
      console.log(this.pedidos)
    });

    this.commerceSubscription = this._comerciosService.getUserRoles().subscribe((snpshot:any) => {      
      
      this.pedidosATomar = [];

      snpshot.forEach( (element, index) => {

        
       // this.pedidosATomar.push(element.payload.doc.data().comercioId)
        this.commerce_id = element.payload.doc.data().comercioId;
        console.log(element.payload.doc.data().rol);

        this.subsPedidosComercio = this.pedidoService.getPedidoPendienteByCommerce(this.commerce_id).subscribe((snapshot) => { 
          this.pedidosATomar[index] = [];
          if(snapshot.length > 0){
            //var primero: any = snapshot[0].payload.doc.data();
            console.log(index)
            
            snapshot.forEach((snap: any) => {
              var pedido:any = snap.payload.doc.data();
              pedido.id = snap.payload.doc.id;
              pedido.createdAt = new Date(pedido.createdAt.seconds)  
              pedido.verRol = element.payload.doc.data().rol;
              this.pedidosATomar[index].push(pedido);              
            });
            console.log(this.pedidosATomar);
          }         
        });

      });       
      
    });
  }

  ionViewDidLeave(){
    if(this.commerceSubscription)
      this.commerceSubscription.unsubscribe();
    
    if(this.subsPedidos)
      this.subsPedidos.unsubscribe();
    
    if(this.subsPedidosComercio)
      this.subsPedidosComercio.unsubscribe();
  }

  showHome(){
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

  recibido(pedido){
    this.pedidoService.setPedidoRecibido(pedido);
    this.router.navigate(['/form-calificacion',{comercioId:pedido.comercioId}]);
  }

  tomado(pedido){    
    this.presentAlert(pedido);    
  }

  listo(pedido){
    this.pedidoService.setPedidoListo(pedido);
  }

  enviado(pedido){
    this.pedidoService.setPedidoEnviado(pedido);
    
  }


  noMostrar(pedido){
    this.pedidoService.setPedidoNoMostrar(pedido);
  }

  async presentAlert(pedido) {
    const alert = await this.alertController.create({
      header: 'Tiempo de Demora',
      inputs: [
        {
          name: 'demora',
          placeholder: 'demora en minutos'
        }
      ],
      message: 'Tiempo de demora en minutos',
      buttons: [        
        {
          text: 'Cancelar',             
        },
        {
          text: 'OK',
          handler: data => {
            console.log(data.demora);
            this.pedidoService.setPedidoTomado(pedido,data.demora);           
          }      
        }
      ]
    });

    await alert.present();
  }


  


}

