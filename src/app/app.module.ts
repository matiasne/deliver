import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './Components/components.module';

registerLocaleData(localeEsAr);

const firebaseConfig = {
  apiKey: "AIzaSyAYAbLJnwJPwltC6tC1NaPjryYuIKTB1zM",
  authDomain: "gestionsocialup.firebaseapp.com",
  databaseURL: "https://gestionsocialup.firebaseio.com",
  projectId: "gestionsocialup",
  storageBucket: "gestionsocialup.appspot.com",
  messagingSenderId: "304287906727",
  appId: "1:304287906727:web:b7e9cdb7f3ddd8bf93d482",
  measurementId: "G-PDRLW20SDT"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    ServiceWorkerModule.register('combined-sw.js', { enabled: environment.production }),
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    FCM,
    BarcodeScanner,
  //  BackgroundMode,
    LocalNotifications,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
