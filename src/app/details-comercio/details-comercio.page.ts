import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController, IonInfiniteScroll, AlertController } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { ComerciosService } from '../services/comercios.service';
import { ProductosService } from '../services/productos.service';
import { Comercio } from '../Models/comercio';
import { PedidoService } from '../services/global/pedido.service';
import { Pedido } from '../Models/pedido';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { FormAgregarPedidoPage } from '../form-agregar-pedido/form-agregar-pedido.page';
import { CarritoPage } from '../carrito/carrito.page';
import { CategoriasService } from '../services/categorias.service';
import { LoadingService } from '../services/loading.service';
import { NotificacionesDesktopService } from '../services/notificaciones-desktop.service';
import { Producto } from '../Models/producto';
import { NotificacionesService } from '../services/notificaciones.service';
import { MesasService } from '../services/mesas.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-details-comercio',
  templateUrl: './details-comercio.page.html',
  styleUrls: ['./details-comercio.page.scss'],
})
export class DetailsComercioPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  comercio:Comercio;
  productos:any = [];
  productosDestacados = [];

  verDestacados = "false";
  verNoDestacados = "true";

  productoSubscription:Subscription;
  comercioSubs:Subscription;
  productoDestacadoSubscription:Subscription;
  catSub:Subscription;
  palabraFiltro = "";
  public actualmenteCerrado = "false";
 
  slideOpts = {
    slidesPerView: 3,
    initialSlide: 2,
    speed: 400,
    autoplay:true
  };

  public pedidoActual:Pedido;
  public productosFiltrados:any = [];
  public categorias = [];
  public filtro = "";
  public ultimoProducto:Producto;
  public comercioUnico = "false";
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private comercioService:ComerciosService,
    private _productsServices:ProductosService,
    private categoriasService:CategoriasService,
    private pedidoService:PedidoService,
    private router: Router,    
    public loadingService: LoadingService,
    private _dataServices:DataService,
    private alertController:AlertController,
    private notificacionesService:NotificacionesService,
    private mesasService:MesasService,
    private toastService:ToastService
  ) { 
    this.comercio = new Comercio();
    this.ultimoProducto = new Producto();
    this.palabraFiltro ="";
  }

  ngOnInit() {     
  
    

    this.actualmenteCerrado = this.route.snapshot.params.cerrado;

    console.log('Cerrado:',this.actualmenteCerrado);

    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    })

    this.loadingService.presentLoading();   
    this.comercioSubs =  this.comercioService.getCommerce(this.route.snapshot.params.id).subscribe((data:any) => {
       this.comercio = data.payload.data();
       this.comercio.id = this.route.snapshot.params.id;

      


       this.catSub = this.categoriasService.getAll(this.comercio.id).subscribe(snapshot =>{
        this.categorias = [];
        console.log(snapshot)
        snapshot.forEach((snap: any) => {       
          var categoria = snap.payload.doc.data();
          categoria.id = snap.payload.doc.id; 
          categoria.seleccionado = false;
          this.categorias.push(categoria);           
        });    
        console.log(this.categorias);
       
      })

      

      this.productoDestacadoSubscription = this._productsServices.getDestacados(this.comercio.id).subscribe(snapshot=>{
        snapshot.forEach((snap: any) => {       
          var producto = snap.payload.doc.data();
          producto.id = snap.payload.doc.id; 
          this.productosDestacados.push(producto);   
        });
        console.log(this.productosDestacados)
      })      

    });  

    this.ultimoProducto  =new Producto();
    this.productos = [];
    this.verMas();

  }


  ionViewDidEnter(){    
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro.toLowerCase();   
  }

  onChange(event){
    this.palabraFiltro = event.target.value.toLowerCase();
    this.ultimoProducto = new Producto();
    this.productos = [];
    this.verMas();
  }

  doRefresh(event){
    this.palabraFiltro = "";
    this.ultimoProducto = new Producto();
    this.productos = [];
    this.verMas();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  verMas(){
    let limit = 7;
    var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    this.loadingService.presentLoading();
    this.productoSubscription = this._productsServices.search(limit,this.route.snapshot.params.id,palabra,this.ultimoProducto.nombre).subscribe((snapshot) => {
     
      this.loadingService.dismissLoading();      
      snapshot.forEach((snap: any) => {                     
        var producto = snap.payload.doc.data();
          producto.id = snap.payload.doc.id;     

        this.productos.push(producto);         
      });  

      console.log(this.productos)
      this.ultimoProducto = this.productos[this.productos.length-1];
      
      this.infiniteScroll.complete();
      this.infiniteScroll.disabled = false;

      if (this.productos.length < limit) {
        this.infiniteScroll.disabled = true;
      }      
      console.log(this.productos);         
      //this.productoSubscription.unsubscribe();
    });

    
  }

 
  verProductos(categoria){

    this.categorias.forEach(c =>{
      c.seleccionado = false;
    })

    if(categoria != ''){      
      categoria.seleccionado = true;
      this.palabraFiltro = categoria.nombre.toLowerCase();
    }
    else{
      this.palabraFiltro = '';
    }


    this.verNoDestacados = "true";
   if(categoria.nombre  == ''){
      this.verDestacados = "true";
    }else{
      this.verDestacados = "false";
    }

    this.ultimoProducto = new Producto();
    this.productos = [];
    this.verMas();
  }

  verProductosDestacados(){
    this.verDestacados = "true";
    this.verNoDestacados = "false";
  }

  
 
  

  showComercios(){
    this.router.navigate(['/comercios']);
  }

  presentModalAgregarPedido(p) {  
    console.log(this.actualmenteCerrado) 
    if(this.actualmenteCerrado == "true"){
      this.toastService.alert("","El comercio se encuentra cerrado, no puedes realizar ahora un pedido")
    }
    else{
      this.router.navigate(['/form-agregar-pedido',{
        productoId:p.id,
        comercioId:this.comercio.id
      }]);
    }
  }

  async irCarrito() {
    
    
      this.router.navigate(['/carrito']);    
    
  }
   

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Que quieres pedir?',
      inputs: [
        {
          name: 'palabra',
          type: 'text',
          placeholder: ''
        },        
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Buscar',
          handler: (data) => {
            console.log('Confirm Ok');
            this.palabraFiltro = data.palabra.toLowerCase();
            this.ultimoProducto = new Producto();
            this.productos = [];
            this.verMas();
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewDidLeave(){
      this.comercioSubs.unsubscribe();
      this.productoSubscription.unsubscribe();
      this.productoDestacadoSubscription.unsubscribe();
      this.catSub.unsubscribe();
  }


  

  

}
