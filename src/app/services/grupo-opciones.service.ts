import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { GrupoOpciones } from '../models/grupoOpciones';

@Injectable({
  providedIn: 'root'
})
export class GrupoOpcionesService {

  getCollection(comeercioId,productoId:any){
    console.log(productoId)
    return 'comercios/'+comeercioId+'/productos/'+productoId+'/grupoOpciones';
  }

  constructor(
    private firestore: AngularFirestore
  ) { }  

 
  public get(comercioId,productoId:any,documentId: string) {
    return this.firestore.collection(this.getCollection(comercioId,productoId)).doc(documentId).snapshotChanges();
  }

  public getAll(comercioId,productoId:any) {   
    return this.firestore.collection(this.getCollection(comercioId,productoId)).snapshotChanges();
  } 


}
