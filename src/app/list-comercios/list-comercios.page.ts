import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CategoriasService } from '../services/categorias.service';
import { ComerciosService } from '../services/comercios.service';
import { PedidoService } from '../services/global/pedido.service';
import { Pedido } from '../Models/pedido';
import { Subscription } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CarritoPage } from '../carrito/carrito.page';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from 'angularfire2/firestore';
import { get } from 'geofirex';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-list-comercios',
  templateUrl: './list-comercios.page.html',
  styleUrls: ['./list-comercios.page.scss'],
})
export class ListComerciosPage implements OnInit {

  
  comercios:any = [];
  public comerciosSubscription: Subscription;
  public palabraFiltro = "";
  

  public pedidoActual:Pedido;
  public loadingActive = false;
  public ultimoComercio = "";

  public comerciosFiltrados = [];
  
  constructor(
    public modalController: ModalController,
    private auth:AuthService,
    private router: Router,
    private _categoriesService:CategoriasService,
    private _comerciosService:ComerciosService,    
    private pedidoService:PedidoService,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public geolocation:Geolocation,
    private firestore: AngularFirestore,
    private loadingService:LoadingService
  ) {

    console.log(this.route.snapshot.params.filtro);

    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;

    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    })
    
    
  }

  ngOnInit(){
    this.ultimoComercio = "";
    

    this.buscarComercio();
  }

  ionViewDidEnter(){

    
  }

  setearAbiertoCerrado(comercio){
    
    var t = new Date();

    
    comercio.estadoHorario= "";

    var nextOpen = false;
    var open = false;

      var horarios =[];

    console.log(comercio.horarios)
    if(comercio.horarios != ""){

      
      comercio.horarios.forEach((horario: any) => {
       
        //var horario = snap.payload.doc.data();
        //horario.id = snap.payload.doc.id; 

        var hd = new Date(horario.desde);
        var hh = new Date(horario.hasta);
        var _horario ={
          dia:horario.dia,
          nombre:horario.nombre,
          desde:{           
            hour:hd.getHours(),
            minute:hd.getMinutes()
          },
          hasta:{            
            hour:hh.getHours(),
            minute:hh.getMinutes()
          }
         
        }
        
        horarios.push(_horario);  

      });

     // console.log(horarios);

      horarios.forEach( (_horario,index) => { 
      
        var hoy ={
          dia : t.getDay(),
          hour: t.getHours(),
          minute : t.getMinutes()
        } 
       
        console.log(hoy)
        console.log(_horario)
        
        var minutesHoy = (1440*hoy.dia) + (60 * hoy.hour) + hoy.minute;   
  
        var timeDesde = 1440*Number(_horario.dia) + 60 * Number(_horario.desde.hour) + Number(_horario.desde.minute);
        var timeHasta = 1440*Number(_horario.dia) + 60 * Number(_horario.hasta.hour) + Number(_horario.hasta.minute);
  
  
        var nombreSiguiente = "";
        var timeDesdeSiguiente = 0;
        var horaSiguiente = 0;
        var minutoSiguiente = 0;        
        var diaSiguiente = 0;

       

        if(index < _horario.length-1){
          diaSiguiente = horarios[index+1].dia;
          nombreSiguiente = horarios[index+1].nombre;
          horaSiguiente = horarios[index+1].desde.hour; 
          minutoSiguiente = horarios[index+1].desde.minute; 
          timeDesdeSiguiente = 1440*Number(horarios[index+1].dia) + 60 * Number(horarios[index+1].desde.hour) + Number(horarios[index+1].desde.minute);
        }
        else{
      //    console.log
          diaSiguiente = horarios[0].dia;
          nombreSiguiente = horarios[0].nombre;  

          horaSiguiente = horarios[0].desde.hour; 
          minutoSiguiente = horarios[0].desde.minute; 
          timeDesdeSiguiente = 1440*8 + 60 * Number(horarios[0].desde.hour) + Number(horarios[0].desde.minute);
        }
  
    
        console.log(timeDesde);
        console.log(minutesHoy)
        console.log(timeHasta)   
        console.log("-----------------------")   

        
  
        if ( timeDesde <= minutesHoy && minutesHoy <= timeHasta) {
          comercio.estadoHorario = "Abierto";  
          return true;
        }  
  
        if (timeHasta <= minutesHoy && minutesHoy <= timeDesdeSiguiente) {
          comercio.estadoHorario = "Cerrado";  
          if(hoy.dia == diaSiguiente){
            nombreSiguiente = "hoy";
          }
          comercio.proximaApertura = "Abre "+nombreSiguiente+" a las "+("0" + horaSiguiente).slice(-2)+":"+("0" + minutoSiguiente).slice(-2)+" hs."; 
          return true;
        }

        if (minutesHoy <= timeDesdeSiguiente) {
          comercio.estadoHorario = "Cerrado";  
         /* if(hoy.dia == diaSiguiente){
            nombreSiguiente = "hoy";
          }*/
          comercio.proximaApertura = "Abre "+nombreSiguiente+" a las "+("0" + horaSiguiente).slice(-2)+":"+("0" + minutoSiguiente).slice(-2)+" hs."; 
          return true;
        }
  
      });
    }

    
  }

  twoDigits(n){
    return n > 9 ? "" + n: "0" + n;
  } 
  
  filtrarComercios() {

    console.log(this.palabraFiltro)
    //this.productosFiltrados = [];
    this.comerciosFiltrados = this.comercios.filter(comercio => {   
      
      var retorno = false;

      var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      var encontrado = false;
      console.log(palabra)
      if(comercio.nombre){
        retorno =  (comercio.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
        if(retorno)
          encontrado = true;
      }
      
      if(comercio.descripcion){
        retorno =  (comercio.descripcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
        if(retorno)
          encontrado = true;
      } 
     

      if(encontrado){
        return true;
      }
    });
  }

  buscarComercio(){
    this.comercios = [];  
    this.ultimoComercio = "";  
    //this.presentLoading();
    console.log(this.palabraFiltro);
       
    console.log(this.palabraFiltro);
    this.loadingService.presentLoading();

    this._comerciosService.getAll().subscribe(snapshot =>{
      
      this.loadingService.dismissLoading();
    //  this.hideLoading();
      this.comercios = [];
    
      snapshot.forEach((snap: any) => {
      
          var comercio = snap.payload.doc.data();
          comercio.id = snap.payload.doc.id; 
          this.setearAbiertoCerrado(comercio);

          let gps =  JSON.parse(this.auth.getGPSUser());
          
          if(gps)
            this.setDistancia(comercio,gps.lat,gps.lng);

          this.comercios.push(comercio);   
        
      });
      console.log(this.comercios);

      if(this.route.snapshot.params.filtro){
        this.palabraFiltro = this.route.snapshot.params.filtro;
        this.filtrarComercios();
      }

    })

    /*this._comerciosService.buscarPorLocalidad("Almafuerte").subscribe(snapshot =>{

      this.hideLoading();
      this.comercios = [];
      console.log(snapshot);
      snapshot.forEach((snap: any) => {
      
          var comercio = snap.payload.doc.data();
          comercio.id = snap.payload.doc.id; 
          this.setearAbiertoCerrado(comercio);

          let gps =  JSON.parse(this.auth.getGPSUser());
          console.log(gps);
          if(gps)
            this.setDistancia(comercio,gps.lat,gps.lng);

          this.comercios.push(comercio);   
        
      });

    })*/
    /*this._comerciosService.buscarPorDistancia(posicionUsuario.lat,posicionUsuario.lng,20,this.palabraFiltro,this.ultimoComercio).then(comercios => {
    
      this.hideLoading();    
      this.comercios = comercios;
      
      this.comercios.forEach(element => {
          this.setearAbiertoCerrado(element);
      });
      console.log(this.comercios);
  
    },error=>{

    });*/
      
    


    
  }

  setDistancia(comercio,lat,lng){
    const geo = geofirex.init(firebase);
    console.log(lat+" "+lng);
    console.log(comercio.posicion)
    if(comercio.posicion.geopoint.Latitude !=""){
      let distancia = Number(geo.distance(geo.point(lat, lng), geo.point(comercio.posicion.geopoint.Latitude, comercio.posicion.geopoint.Longitude)).toFixed(2))

      if(distancia){
        if(distancia >= 1){       
          comercio.distancia = distancia+" Km.";
        } 
        else{
          if(distancia > 0)
            comercio.distancia = distancia*100+" Metros";
        }
      }
      

      console.log(geo.bearing(geo.point(lat, lng), geo.point(comercio.posicion.geopoint.Latitude, comercio.posicion.geopoint.Longitude)));
    }  
  }

  


  

  async presentLoading() {
    this.loadingActive = true;
    const loading = await this.loadingController.create({
      message: 'Cargando Comercios...',
    });
    await loading.present();
  }


  hideLoading(){
    
      this.loadingController.dismiss();
      this.loadingActive = false;
    
  }

  showComercio(comercio){
    if(comercio.estadoHorario == "Cerrado"){
      this.presentAlert("El comercio se encuentra actualmente cerrado! "+comercio.proximaApertura);
    }
    this.router.navigate(['/details-comercio',{"id":comercio.id}]);
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Cerrado',
      message: message,
      buttons: [
        {
          text: 'Volver', 
          handler: data => {
            this.router.navigate(['/list-comercios']);            
          } 
        },
        {
          text: 'Continuar',
          handler: data => {
                     
          }      
        }
      ]
    });

    await alert.present();
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

  async irCarrito() {
    this.router.navigate(['/carrito']);
  }
}
		
