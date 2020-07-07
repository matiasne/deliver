import { Injectable } from '@angular/core';
import { Producto } from '../Models/producto';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private collection:string;
  private productos:Producto[];
  public commerceSubject = new BehaviorSubject <any>("");

  constructor(
    private firestore: AngularFirestore,
    private auth:AuthService
  )
  {
    
  }

  public get(id){
    return this.firestore.collection(this.collection).doc(id).snapshotChanges();
  }

  public getAll(commerce_id){
    
    this.collection = 'comercios/'+commerce_id+'/productos';
    return this.firestore.collection(this.collection, ref => ref.orderBy('nombre')).snapshotChanges();    
  }

  public getDestacados(commerce_id){
    this.collection = 'comercios/'+commerce_id+'/productos';
    return this.firestore.collection(this.collection, ref => ref.where('destacado','==',true)).snapshotChanges();    
  }

  
  public search(commerce_id,palabra,ultimo){
    this.collection = 'comercios/'+commerce_id+'/productos';
    console.log(palabra)
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
}
