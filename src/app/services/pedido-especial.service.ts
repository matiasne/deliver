import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { PedidoParticular } from '../Models/pedidoParticular';
import { AuthService } from './auth.service';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoEspecialService {

  private collection:string;

  constructor(
    private firestore: AngularFirestore,
    private auth:AuthService,
    private notificacionesService:NotificacionesService
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

  public getAllByClient(id){
    return this.firestore.collection(this.collection,ref => ref.where("remitenteId","==",id)).snapshotChanges();
  }

  public update(data:PedidoParticular) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.collection).doc(data.id).set(param);
  }

  public delete(data:PedidoParticular){    
    this.firestore.collection(this.collection).doc(data.id).delete();
  } 

  //accion del cadete
  public setPedidoRechazado(pedido){

    if(pedido.remitenteId)
      this.notificacionesService.enviarById(pedido.remitenteId,"El pedido ha sido rechazado!","El cadete ha rechazado tu pedido.");
    
    this.firestore.collection(this.collection).doc(pedido.id).update({rechazado: 1});
    if(pedido.confirmacionRechazo == 1 ){
      this.delete(pedido);
    }


  }

  //accion del cadete
  public setPedidoEntregado(pedido){
    this.firestore.collection(this.collection).doc(pedido.id).update({entregado: 1});
    if(pedido.recibido == 1 ){
      this.delete(pedido);
    }

  }

  //accion del cliente
  public setPedidoRecibido(pedido){
    this.firestore.collection(this.collection).doc(pedido.id).update({recibido: 1});    
    if(pedido.entregado ==1 ){
      this.delete(pedido);
    }
  }

  //accion del cliente
  public setConfirmarRechazo(pedido){
    this.firestore.collection(this.collection).doc(pedido.id).update({confirmacionRechazo: 1});    
    if(pedido.rechazado ==1 ){
      this.delete(pedido);
    }
  }

}
