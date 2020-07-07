import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  
  constructor(
    private firestore: AngularFirestore
  ) {
    
  }

  public getAll(comercioId){

    return this.firestore.collection('comercios/'+comercioId+'/categorias').snapshotChanges();
  }  


}
