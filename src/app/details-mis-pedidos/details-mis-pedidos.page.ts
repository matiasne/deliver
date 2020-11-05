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

 
  public pedidosCliente;
  public pedidosATomar;
  public pedidosABuscar;
  public commerce_id;

  public commerceSubscription:Subscription;
  public subsPedidos:Subscription;
  public subsPedidosComercio:Subscription;

  public sinPedidos = true;

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
    this.pedidosCliente = [];
    this.pedidosABuscar = [];
    this.pedidosATomar = [];
  }

  ngOnInit() {
  }

  ionViewDidEnter() {

    //Usuario clásico: solo los pedidos de ese usuario
    this.subsPedidos = this.pedidoService.getPedidosCliente().subscribe((snapshot) => {
      this.pedidosCliente = [];      
      snapshot.forEach((snap: any) => {
        let pedido:any = snap.payload.doc.data();
        pedido.id = snap.payload.doc.id; 
        if(pedido.recibido == "0"){
          this.sinPedidos = false;
          this.pedidosCliente.push(pedido); 
        }
          
          
        let timeNow = new Date().getTime();
        pedido.faltanMinutos = Math.ceil((pedido.demora - timeNow) / 60000);
        console.log(pedido.demora+" "+timeNow)
        console.log(pedido.faltanMinutos)       
        
        if(pedido.faltanMinutos < 0){
          pedido.faltanMinutos = 0;
        } 
      });
      console.log(this.pedidosCliente.length)
    });

    this.commerceSubscription = this._comerciosService.getUserRoles().subscribe((snpshot:any) => {      
      
      this.pedidosATomar = [];
      this.pedidosABuscar = [];

      snpshot.forEach( (element, index) => {        
       // this.pedidosATomar.push(element.payload.doc.data().comercioId)
        this.commerce_id = element.payload.doc.data().comercioId;
        console.log(element.payload.doc.data().rol);

        this.subsPedidosComercio = this.pedidoService.getPedidoPendienteByCommerce(this.commerce_id).subscribe((snapshot) => { 
          this.pedidosATomar[index] = [];
          this.pedidosABuscar[index] = [];
          console.log(snapshot)
          if(snapshot.length > 0){
            //var primero: any = snapshot[0].payload.doc.data();           
          
            snapshot.forEach((snap: any) => {
              
              var pedido:any = snap.payload.doc.data();
              pedido.id = snap.payload.doc.id;
              console.log(pedido)
            
              pedido.verRol = element.payload.doc.data().rol;
              console.log(pedido.verRol)
              if(pedido.verRol == 'cadete'){
                if(pedido.buscado == "0" && pedido.rechazado == "0"){
                  this.pedidosABuscar[index].push(pedido);   
                  this.sinPedidos = false;
                }
              }
                
              if(pedido.verRol == 'owner'){
                if(pedido.comercio_nomostrar == "0"){
                  this.pedidosATomar[index].push(pedido);
                  this.sinPedidos = false;
                }
               
              }

              let timeNow = new Date().getTime();
              pedido.faltanMinutos = Math.ceil((pedido.demora - timeNow) / 60000);
              console.log(pedido.demora+" "+timeNow)
              console.log(pedido.faltanMinutos)
              
              
              if(pedido.faltanMinutos < 0){
                pedido.faltanMinutos = 0;
              }
            });

        
          }  
          
        });

      });       
      
    });
  }

  toDateTime(date) {
    var t = new Date(1970, 0, 1,0,0,0,0); // Epoch
    
    t.setDate(date);
    console.log(date)
    console.log(t)
    return t;
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

  buscado(pedido){
    this.pedidoService.setPedidoBuscado(pedido);
  }

  tomado(pedido){    
    this.presentAlert(pedido);    
  }

  async listo(pedido){

    const alert = await this.alertController.create({
      header: 'Esta seguro?',
      message: 'Está seguro que el pedido está entregado?',
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
            this.pedidoService.setPedidoListo(pedido);
            
          }
        }
      ]
    });

    await alert.present();

    
  }

  enviado(pedido){
    this.pedidoService.setPedidoEnviado(pedido);    
  }

  borrar(pedido){
    this.pedidoService.borrarPedido(pedido);
  }

  noMostrar(pedido){
    this.pedidoService.setPedidoNoMostrar(pedido);
  }

  async presentAlert(pedido) {
    const alert = await this.alertController.create({
      header: 'Demora',
      message: 'Tiempo de demora en minutos',
      buttons: [        
        {
          text: 'Cancelar',             
        },
        {
          text: '10 a 20 minutos',
          handler: data => {
            this.pedidoService.setPedidoTomado(pedido,20);           
          }      
        },
        {
          text: '20 a 40 minutos',
          handler: data => {
            this.pedidoService.setPedidoTomado(pedido,40);           
          }      
        },
        {
          text: '40 minutos o más',
          handler: data => {
            this.pedidoService.setPedidoTomado(pedido,60);           
          }      
        }
      ]
    });

    await alert.present();
  }


  async rechazar(pedido) {
    
    const alert = await this.alertController.create({
      header: 'Esta seguro?',
      message: 'Está seguro que desea rechazar el pedido?',
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
            this.pedidoService.setPedidoRechazado(pedido);
            
          }
        }
      ]
    });

    await alert.present();
  }
  


}

