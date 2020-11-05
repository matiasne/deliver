import { Component } from '@angular/core';

import { Platform, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FCM } from '@ionic-native/fcm/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NotificacionesDesktopService } from './services/notificaciones-desktop.service';
import { ToastService } from './services/toast.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent  {
  
  
  public photoURL = 0;
  public displayName = "";
  public isLoggedIn = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth:AuthService,
    private router: Router,
    public alertController: AlertController,
    private fcm: FCM,
    private geolocation:Geolocation,
    private route: ActivatedRoute,
    private notifiacionesDesktopService:NotificacionesDesktopService,
    private toastService:ToastService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
   
}

  initializeApp() {
    console.log("NgOnInit")
    this.notifiacionesDesktopService.init().then(data=>{
      console.log("OK")
    },error=>{
      console.log("ERROR");
    });

    this.platform.ready().then(() => {

      //Esto es para web desktop
      this.notifiacionesDesktopService.requestPermission();     

      this.geolocation.getCurrentPosition().then((resp) => { 
        this.auth.updateGPSUSer(resp.coords.latitude,resp.coords.longitude);
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
     // this.backgroundMode.enable();
      this.photoURL = 0;  
     
      this.auth.authenticationState.subscribe(state => {
       
        if (state) {        
          this.displayName = this.auth.getNombre();
          this.photoURL = this.auth.getActualUser().photoURL;
          this.isLoggedIn = true;     

          if (this.platform.is('cordova')) {
            
            this.fcm.subscribeToTopic('marketing');
        
            this.fcm.getToken().then(token => {  
              console.log(token);   
              this.auth.setFCMToken(token);
            },error=>{
              console.log(error)
            });
        
            this.fcm.onTokenRefresh().subscribe(token => {    
              console.log(token);     
              this.auth.setFCMToken(token);
            },error=>{
              console.log(error)
            });     
        
            this.fcm.onNotification().subscribe(data => {
              if(data.wasTapped){
                this.toastService.mensaje(data.title,data.body);
                console.log(data.body);
                //this.toastService.mensaje("")
              } else {
                console.log(data);
                this.toastService.mensaje(data.title,data.body);
              };
            });
          }
          
        } else {
          this.isLoggedIn = false;
        //  this.router.navigate(['login']);
        }
      });
    });
  }

  

  logout(){
    this.auth.logout();
  }

  misDatos(){
    if(this.isLoggedIn)
      this.router.navigate(['/form-mis-datos']);
    else
      this.router.navigate(['/login']);
  }

  misPedidos(){
    if(this.isLoggedIn)
      this.router.navigate(['/details-mis-pedidos']);
    else
      this.router.navigate(['/login']);
  }

  irLogin(){
    this.router.navigate(['/login']);
  }

  terminos(){
    this.router.navigate(['/details-terminos-condiciones']);   
  }

  preguntas(){
    this.router.navigate(['/details-preguntas-frecuentes']);
  }

  irHome(){

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
}
