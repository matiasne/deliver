import { Injectable } from '@angular/core';
import { Comercio } from '../Models/comercio';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { get } from 'geofirex';

@Injectable({
  providedIn: 'root'
})
export class ComerciosService {

  private collection:string;
  public commerceSubject = new BehaviorSubject <any>("");

  constructor(
    private firestore: AngularFirestore,
    private auth:AuthService,
    
  )
  {
    this.collection = 'comercios';
  }

  public getCommerce(documentId: string) {
    return this.firestore.collection(this.collection, ref => ref.where("localidad","==","Almafuerte")).doc(documentId).snapshotChanges();
  }

  public getUserRoles(){
    let user_email = this.auth.getActualUser().email;
    console.log(user_email);
    return this.firestore.collection('roles', ref => ref.where('user_email', '==', user_email)).snapshotChanges();
  }

  public getAll(){
    return this.firestore.collection(this.collection, ref => ref.where("localidad","==","Almafuerte").orderBy('nombre')).snapshotChanges();    
  }  

  public getHorarios(comercioId){
    return this.firestore.collection(this.collection+"/"+comercioId+"/horarios",ref=>ref.orderBy('dia','asc')).snapshotChanges();    
  }  

  public getUltimos(){
    return this.firestore.collection(this.collection, ref => ref.where("localidad","==","Almafuerte").orderBy('createdAt','asc').limit(5)).snapshotChanges(); 
  }

  public buscarPorLocalidad(localidad){
    return this.firestore.collection(this.collection, ref => ref.where("localidad","==","Almafuerte").orderBy('createdAt','asc').limit(5)).snapshotChanges(); 
  }


  async buscarPorDistancia(lat,lng,radio,palabra,ultimo){
      const geo = geofirex.init(firebase);   

      const center = geo.point(lat, lng);
      const radius = radio;
      const field = 'posicion';
     
      const query = geo.query('comercios').within(center, radius, field,{log:true})
      return get(query);
      
  }

  

  
  public search(posicionActual,palabra,ultimo){

 
    
    
    if(ultimo == ""){
      console.log("!!!!!! primero")     
      return this.firestore.collection(this.collection, ref => 
        ref.where('keywords','array-contains',palabra)
            .where('recibirPedidos','==',true)
            .orderBy('nombre')
            .limit(5)).snapshotChanges();
    }
    else{
      return this.firestore.collection(this.collection, ref => 
        ref.where('keywords','array-contains',palabra)
            .where('recibirPedidos','==',true)
            .orderBy('nombre')
            .startAfter(ultimo)
            .limit(5)).snapshotChanges();    
    }
    
  }  

  public setComercioSeleccionado(commerce){
    localStorage.setItem('commercio_seleccionado',commerce);
  }

  public getComercioSeleccionado(){
    localStorage.getItem('commercio_seleccionado');
  }
}
