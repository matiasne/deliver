import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CategoriasService } from '../services/categorias.service';
import { ComerciosService } from '../services/comercios.service';
import { PedidoService } from '../services/global/pedido.service';
import { Pedido } from '../Models/pedido';
import { Subscription } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoadingService } from '../services/loading.service';
import { Comercio } from '../Models/comercio';

@Component({
  selector: 'app-list-comercios',
  templateUrl: './list-comercios.page.html',
  styleUrls: ['./list-comercios.page.scss'],
})
export class ListComerciosPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  comercios:any = [];
  public comerciosSubscription: Subscription;
  public palabraFiltro = "";
  

  public pedidoActual:Pedido;
  public loadingActive = false;
  public ultimoComercio:Comercio;

  public comerciosFiltrados = [];
  
  constructor(
    public modalController: ModalController,
    private auth:AuthService,
    private router: Router,
    private _comerciosService:ComerciosService,    
    private pedidoService:PedidoService,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public geolocation:Geolocation,
    private firestore: AngularFirestore,
    private loadingService:LoadingService
  ) {

   

    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    })
    
    
  }

  ngOnInit() {   
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro; 
    this.ultimoComercio  =new Comercio();
    
    this.loadingService.presentLoading();   
    this.comercios = [];
    
   this.comerciosSubscription = this._comerciosService.start(this.palabraFiltro).subscribe((snapshot) => {
     
      this.loadingService.dismissLoading();
      this.comercios = [];
      snapshot.forEach((snap: any) => {      
                
        var comercio = snap.payload.doc.data();
        comercio.id = snap.payload.doc.id; 

        console.log(comercio)
        this.setearAbiertoCerrado(comercio);
        let gps =  JSON.parse(this.auth.getGPSUser());        
        if(gps)
          this.setDistancia(comercio,gps.lat,gps.lng);
        this.comercios.push(comercio);
        
      });  

      this.ultimoComercio = this.comercios[this.comercios.length-1];
      
      this.infiniteScroll.complete(); 
      this.infiniteScroll.disabled = false;

      if (this.comercios.length < 10) {
        this.infiniteScroll.disabled = true;
      }      
      console.log(this.comercios);         
      this.comerciosSubscription.unsubscribe();
    });
   


    
  }

  ionViewDidEnter(){ 
    
  }

  ionViewDidLeave(){
    this.comerciosSubscription.unsubscribe();
  }

  onChange(event){
    this.palabraFiltro = event.target.value.toLowerCase();
    this.ultimoComercio = new Comercio();
    this.comercios = [];
    this.verMas();
  }


  verMas(){
    let limit = 10;
    var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    this.loadingService.presentLoading();
    this.comerciosSubscription = this._comerciosService.search(limit,palabra,this.ultimoComercio.nombre).subscribe((snapshot) => {
     
      this.loadingService.dismissLoading();
     
      snapshot.forEach((snap: any) => {      
                
        var comercio = snap.payload.doc.data();
        comercio.id = snap.payload.doc.id; 

        console.log(comercio)
        this.setearAbiertoCerrado(comercio);
        let gps =  JSON.parse(this.auth.getGPSUser());        
        if(gps)
          this.setDistancia(comercio,gps.lat,gps.lng);
        this.comercios.push(comercio);
        
      });  

      this.ultimoComercio = this.comercios[this.comercios.length-1];
      
      this.infiniteScroll.complete();
      this.infiniteScroll.disabled = false;

      if (this.comercios.length < limit) {
        this.infiniteScroll.disabled = true;
      }      
      console.log(this.comercios);         
     // this.comerciosSubscription.unsubscribe();
    });

    
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

      var ahora ={
        dia : t.getDay(),
        hour: t.getHours(),
        minute : t.getMinutes()
      } 
      console.log("-----------------------") 
      console.log("Comercio:"+comercio.nombre)

      for(let i=0; i< horarios.length; i++) {      
        
        console.log("Ahora:")
        console.log(ahora)
        console.log("Analizando:")
        console.log(horarios[i])
        
        var minutesHoy = (1440*ahora.dia) + (60 * ahora.hour) + ahora.minute; 
        var timeDesde = 1440*Number(horarios[i].dia) + 60 * Number(horarios[i].desde.hour) + Number(horarios[i].desde.minute);
        var timeHasta = 1440*Number(horarios[i].dia) + 60 * Number(horarios[i].hasta.hour) + Number(horarios[i].hasta.minute);
    
        var timeDesdeSiguiente = 0;       

        let indexSiguiente = 0;
        if(i < horarios.length-1){
          indexSiguiente = i+1;         
        }
        else{
          indexSiguiente = 0;
        }

        console.log("Siguiente:")
        console.log(horarios[indexSiguiente]);

        let _horarioSiguiente = horarios[indexSiguiente];
        timeDesdeSiguiente = 1440*Number(_horarioSiguiente.dia) + 60 * Number(_horarioSiguiente.desde.hour) + Number(_horarioSiguiente.desde.minute);
     
        console.log(minutesHoy);
        console.log(timeDesde);       
        console.log(timeHasta)   
         

        
  
        if ( timeDesde <= minutesHoy && minutesHoy <= timeHasta) { //Está dentro del periodo
          comercio.estadoHorario = "Abierto";  
          return true;
        }  
  
        if (timeHasta <= minutesHoy && minutesHoy <= timeDesdeSiguiente) {
          comercio.estadoHorario = "Cerrado";  
          if(ahora.dia == _horarioSiguiente.dia){
            _horarioSiguiente.nombre = "hoy";
          }
          comercio.proximaApertura = "Abre "+_horarioSiguiente.nombre+" a las "+("0" + _horarioSiguiente.desde.hour).slice(-2)+":"+("0" + _horarioSiguiente.desde.minute).slice(-2)+" hs."; 
          return true;
        }

       // if (minutesHoy <= timeDesdeSiguiente) {
          comercio.estadoHorario = "Cerrado";  
          comercio.proximaApertura = "Abre "+_horarioSiguiente.nombre+" a las "+("0" + _horarioSiguiente.desde.hour).slice(-2)+":"+("0" + _horarioSiguiente.desde.minute).slice(-2)+" hs."; 
         
        //}
  
      };
    }

    
  }

  twoDigits(n){
    return n > 9 ? "" + n: "0" + n;
  } 
  
  filtrarComercios() {

    this.ultimoComercio = new Comercio();
    this.comercios = [];
    this.verMas();
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

  


  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Donde quieres pedir?',
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
            this.ultimoComercio = new Comercio();
            this.comercios = [];
            this.verMas();
          }
        }
      ]
    });

    await alert.present();
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
    let cerrado = false;
    if(comercio.estadoHorario == "Cerrado"){
      cerrado = true;
      this.presentAlert("El comercio se encuentra actualmente cerrado! "+comercio.proximaApertura);
    }
    this.router.navigate(['/details-comercio',{
      "id":comercio.id,
      cerrado:cerrado
    }]);
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

  doRefresh(event) {
    this.ultimoComercio = new Comercio();
    this.comercios = [];
    this.verMas();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
		
