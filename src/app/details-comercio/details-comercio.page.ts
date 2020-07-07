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
  palabraFiltro = "";
 
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
    private mesasService:MesasService
  ) { 
    this.comercio = new Comercio();
    this.palabraFiltro ="";
  }

  ngOnInit() {  
    
  
    
    if(this.route.snapshot.params.enLocal){
      localStorage.setItem('enLocal',"true");
    }
    else{
      localStorage.setItem('enLocal',"false");
    }

    if(this.route.snapshot.params.porWhatsapp){
      localStorage.setItem('porWhatsapp',"true");
    }
    else{
      localStorage.setItem('porWhatsapp',"false");
    }
   
    if(this.route.snapshot.params.comercioUnico){
      localStorage.setItem('comercioUnico',"true");
      this.comercioUnico = localStorage.getItem('comercioUnico');
      if(this.route.snapshot.params.id)
        localStorage.setItem('comercioUnicoId',this.route.snapshot.params.id)
    }
  

    

    console.log(this.route.snapshot.params.mesaId);
    console.log(this.route.snapshot.params.comercioUnico);  
    console.log(this.route.snapshot.params.id);
    console.log(this.route.snapshot.params.mesaId);

    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    })
    this.loadingService.presentLoading();   
    this.comercioSubs =  this.comercioService.getCommerce(this.route.snapshot.params.id).subscribe((data:any) => {
       this.comercio = data.payload.data();
       this.comercio.id = this.route.snapshot.params.id;


       if(this.route.snapshot.params.enLocal){
        console.log("Pedido en local")
        if(this.route.snapshot.params.mesaId){
          this.mesasService.get(this.comercio.id,this.route.snapshot.params.mesaId).subscribe(snap=>{
            
            let mesa:any = snap.payload.data();
            console.log(mesa)
            mesa.rolEncargados.forEach(encargadoRolId => {
              this.notificacionesService.enviarByRolId(encargadoRolId,"La mesa :"+mesa.nombre+" ha solicitado la carta","")
            });         
          })
        }
       }


       var catSub = this.categoriasService.getAll(this.comercio.id).subscribe(snapshot =>{
        this.categorias = [];
        snapshot.forEach((snap: any) => {       
          var categoria = snap.payload.doc.data();
          categoria.id = snap.payload.doc.id; 
          categoria.seleccionado = false;
          this.categorias.push(categoria);           
        });    
        console.log(this.categorias);
        catSub.unsubscribe();
      })

      this.productoSubscription = this._productsServices.getAll(this.comercio.id).subscribe((snapshot) => {
        this.productos = [];
        this.loadingService.dismissLoading();   
       
        snapshot.forEach((snap: any) => {         
          var producto = snap.payload.doc.data();
          producto.id = snap.payload.doc.id; 
          this.productos.push(producto);            
          
        });    
        console.log(this.productos);         
        this.filtrarProductos();
      });

      this.productoDestacadoSubscription = this._productsServices.getDestacados(this.comercio.id).subscribe(snapshot=>{
        snapshot.forEach((snap: any) => {       
          var producto = snap.payload.doc.data();
          producto.id = snap.payload.doc.id; 
          this.productosDestacados.push(producto);   
        });
        console.log(this.productosDestacados)
      })      

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

    this.filtrarProductos();
  }

  verProductosDestacados(){
    this.verDestacados = "true";
    this.verNoDestacados = "false";
  }

  
  filtrarProductos() {

    console.log(this.palabraFiltro)
    //this.productosFiltrados = [];
    this.productosFiltrados = this.productos.filter(producto => {   
      
      var retorno = false;

      var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      var encontrado = false;
      console.log(palabra)
      if(producto.nombre){
        retorno =  (producto.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
        if(retorno)
          encontrado = true;
      }
      
        
      if(producto.categorias.length > 0){
        producto.categorias.forEach(categoria => {
          retorno =  (categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno){
            encontrado = true;

          }
            
        });
       
      }

      if(encontrado){
        return true;
      }
    });
  }


  

  showComercios(){
    this.router.navigate(['/comercios']);
  }

  presentModalAgregarPedido(p) {
    

    this.router.navigate(['/form-agregar-pedido',{
      productoId:p.id,
      comercioId:this.comercio.id
    }]);
  }

  async irCarrito() {
    this.router.navigate(['/carrito']);
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Que deseas buscar?',
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
            this.palabraFiltro = data.palabra;
            this.filtrarProductos();
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
  }

  

}
