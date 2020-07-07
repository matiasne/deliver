import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private collection:string;

  constructor(
    private firestore: AngularFirestore,
  ) { 
    this.collection = 'users';
  }

  public get(documentId: string) {
    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getByEmail(email){
    return this.firestore.collection(this.collection, ref => ref.where('email', '==', email)).snapshotChanges();
  }

  public getAll(){
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  public updateNotificaiconesWebToke(id,token){
    let param = {
      notificacionesWebToken:token
    }
    console.log("seteando token: "+id)
    this.firestore.collection(this.collection).doc(id).set(param, { merge: true });
  }

  public updateNotificaiconesCelularToke(id,token){
    let param = {
      notificacionesCelularToke:token
    }
    this.firestore.collection(this.collection).doc(id).set(param, { merge: true });
  }

}
