import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Rol } from '../Models/rol';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private collection:string;
  
  constructor(
    private firestore: AngularFirestore,
    private auth:AuthService
  ) {
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    this.collection = 'roles';
  }
  
  public create(data:Rol) {   
    const param = JSON.parse(JSON.stringify(data));
    
    return this.firestore.collection(this.collection).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public get(documentId: string) {
    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getAllTipos() {   
    return this.firestore.collection('roles_tipos').snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  public getAllRolesbyUser() {  
    let user_email = this.auth.getActualUser().email; 
    return this.firestore.collection('roles', ref => ref.where('user_email', '==', user_email)).get({ source: 'server' })
    .pipe(
      map(actions => {
        const data = [];       
        actions.forEach(a => {
          const item = a.data() ;
          item.id = a.id;
          data.push(item);
        });
        return data;
      })
    )

  }  

  getAllRolesbyComercio(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    console.log(comercio_seleccionadoId)
    return this.firestore.collection('roles', ref => ref.where('comercioId', '==', comercio_seleccionadoId)).snapshotChanges();/*.get({ source: 'server' })
    .pipe(
      map(actions => {
        const data = [];       
        actions.forEach(a => {
          const item = a.data() ;
          item.id = a.id;
          console.log(item)
          data.push(item);
        });
        return data;
      })
    )*/
  }

  public setUserAsOwner(user_email,comercioId){   
 
    let params = {
      user_email : user_email,
      comercioId : comercioId,
      rol : "owner"
    }
    this.firestore.collection(this.collection).add(Object.assign({}, params));       
  } 

  public getAllOwnerId(){
    return this.firestore.collection(this.collection, ref=>ref.where("rol","==","owner")).snapshotChanges();
  }

  public update(documentId: string, data: any) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.collection).doc(documentId).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(documentId: string) {
    return this.firestore.collection(this.collection).doc(documentId).delete();
  }

  deleteByComercio(comercioId){
    this.firestore.collection('roles', ref => ref.where('comercioId', '==', comercioId)).snapshotChanges().subscribe(snapshot=>{
      snapshot.forEach(snap =>{

        console.log("Eliminando roles del comercio: "+comercioId);
        var rolid:any = snap.payload.doc.id;
        this.delete(rolid);

      });
    });
  }
}
