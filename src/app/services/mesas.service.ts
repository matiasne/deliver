import { Injectable } from '@angular/core';
import { Mesa } from '../Models/mesa';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  constructor(
    private firestore: AngularFirestore
  ) {
    
  }

  getCollection(comercioId:any){
    console.log(comercioId)
    return 'comercios/'+comercioId+'/mesas';
  }
  
  public create(data:Mesa) {   

    console.log(data);
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).set(param);
  }

  public get(comercioId:any,documentId: string) {
    return this.firestore.collection(this.getCollection(comercioId)).doc(documentId).snapshotChanges();
  }

  public getAll(comercioId:any) {   
    return this.firestore.collection(this.getCollection(comercioId)).snapshotChanges();
  } 

  public update(data:Mesa) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).set(param);
  }

  public delete(data:Mesa){    
    this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).delete();
  } 
}
