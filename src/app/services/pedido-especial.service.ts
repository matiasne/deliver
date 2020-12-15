import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { PedidoParticular } from '../Models/pedidoParticular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoEspecialService {

  private collection:string;

  constructor(
    private firestore: AngularFirestore,
    private auth:AuthService
  ) { 
    this.collection = "pedidosParticulares"
  }

  public create(data:PedidoParticular) { 
    console.log(data);
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.collection).add(param);
  }

  public get(documentId) {
    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collection(this.collection).snapshotChanges();
  } 

  public update(data:PedidoParticular) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.collection).doc(data.id).set(param);
  }

  public delete(data:PedidoParticular){    
    this.firestore.collection(this.collection).doc(data.id).delete();
  } 

}
