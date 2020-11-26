import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriasService } from '../services/categorias.service';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../services/comercios.service';
import { PedidoService } from '../services/global/pedido.service';
import { Pedido } from '../Models/pedido';
import { ModalController, LoadingController, Platform, AlertController, NavController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { CarritoPage } from '../carrito/carrito.page';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage  {

  categorias:any = [];
  comercios:any = [];
  filtro ="";
  pedidos:any = [];
  public categoriesSubscription: Subscription;
  public comerciosSubscription: Subscription;
  public subscription: Subscription;
  public backSubscription: Subscription;
  public commerceSubscription:Subscription;
  public commerce_id:any;
  
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 4,
    autoplay:true
  };

  slideOptsCategorias = {
    slidesPerView: 3,
    initialSlide: 0,
    speed: 400,
    autoplay:true
  }

  slideOpts={
    autoplay:true
  };

  public pedidoActual:Pedido;
  
  public isMobile = false;
  
  barcodeScannerOptions: BarcodeScannerOptions;

  
  
  constructor(
    public modalController: ModalController,
    private auth:AuthService,
    private router: Router,
    private _categoriesService:CategoriasService,
    private _comerciosService:ComerciosService,    
    private pedidoService:PedidoService,    
    public alertController: AlertController,
    public loadingController: LoadingController,
    public platform:Platform,
    private localNotifications: LocalNotifications,
    private barcodeScanner: BarcodeScanner,
    private route:ActivatedRoute
  ) {

   
   
      localStorage.setItem('porWhatsapp',"false");

    


    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };

    if (this.platform.is('cordova')) {
      this.isMobile = true;
    }

    
  
    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    });

    
    //this.presentLoading();
    this.comerciosSubscription = this._comerciosService.getUltimos().subscribe((snapshot) => {
      this.comercios = [];
      var agregados = 0;
      snapshot.forEach((snap: any, index) => {

        var comercio = snap.payload.doc.data();  
        comercio.id = snap.payload.doc.id;
        this.setearAbiertoCerrado(comercio);  
        this.comercios.push(comercio);
              
      });
      console.log(this.comercios);  
      //this.hideLoading();    
      this.comerciosSubscription.unsubscribe();
    });    
  }


  ngOnInit(){

    this.subscription = this.platform.backButton.subscribe(() => {
      
      this.presentAlert();
    
    });

    localStorage.removeItem('comercioUnicoId')
    localStorage.removeItem('enLocal')
    localStorage.removeItem('comercioUnico')

    
  }

  lectorDeCodigo() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        console.log("Barcode data " + barcodeData.text);
        var datos:any = this.getJsonFromUrl(barcodeData.text)
        console.log(datos);
        if(datos.id){
          this.router.navigate(['details-comercio',{
            id:datos.id,
            mesaId:datos.mesaId
          }])
        }
        
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  pedido(){
    var  element = document.createElement('a') as HTMLElement;
    element.setAttribute('href', 'https://wa.me/5493571666966?text=Hola! Necesito un pedido especial');
    element.setAttribute('style', 'display:none;');
    element.click();
  }

  getJsonFromUrl(url) {
    if(!url) url = location.href;
    var question = url.indexOf("details-comercio;");
    var hash = url.indexOf("#");
    if(hash==-1 && question==-1) return {};
    if(hash==-1) hash = url.length;
    var query = question==-1 || hash==question+1 ? url.substring(hash) : 
    url.substring(question+1,hash);
    var result = {};
    query.split(";").forEach(function(part) {
      if(!part) return;
      part = part.split("+").join(" "); // replace every + with space, regexp-free version
      var eq = part.indexOf("=");
      var key = eq>-1 ? part.substr(0,eq) : part;
      var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
      var from = key.indexOf("[");
      if(from==-1) result[decodeURIComponent(key)] = val;
      else {
        var to = key.indexOf("]",from);
        var index = decodeURIComponent(key.substring(from+1,to));
        key = decodeURIComponent(key.substring(0,from));
        if(!result[key]) result[key] = [];
        if(!index) result[key].push(val);
        else result[key][index] = val;
      }
    });
    return result;
  }

  pushNotification(message){
    if (this.platform.is('cordova')) {
      this.localNotifications.schedule({
        text: message,
        led: 'FF0000',
        sound: null
      });
    }
  }
  
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando Comercios...',
    });
    await loading.present();
  }

  verComerciosFiltrados(palabra){
    this.filtro = palabra;
    this.router.navigate(['/list-comercios',{"filtro":this.filtro}]);
  }

  showComercio(comercio){
    let cerrado = false;
    if(comercio.estadoHorario == "Cerrado"){
      cerrado = true;
      this.presentAlertCerrado("El comercio se encuentra actualmente cerrado! "+comercio.proximaApertura);
    }
    this.router.navigate(['/details-comercio',{
      "id":comercio.id,
      cerrado:cerrado
    }]);
  }

  async presentAlertCerrado(message) {
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

  hideLoading(){
    this.loadingController.dismiss();
  }

  async irCarrito() {
    if(this.pedidoActual.on)
      this.router.navigate(['/carrito']);
    else
      alert("No tienes nigún producto en tu carrito aún")
  }  


  verMas(){
    
  }

  showComercios(filtro){
    this.router.navigate(['/list-comercios',{filtro:filtro}]);
  }

  showComerciosSearch(){
    this.router.navigate(['/list-comercios',{filtro:this.filtro}]);
  } 

  ionViewDidLeave(){
      this.subscription.unsubscribe();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Salir',     
      message: 'Esta seguro que desea salir?',
      buttons: [        
        {
          text: 'Cancelar', 
          handler: data => {
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
                 
        },
        {
          text: 'OK',
          handler: data => {
            navigator['app'].exitApp();          
          }      
        }
      ]
    });

    await alert.present();
  }

  
  async presentAlertDatos(message) {

    const alert = await this.alertController.create({
      header: 'Gracias!!',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
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

  

}
