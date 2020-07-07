import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Calificacion } from '../Models/calificacion';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {

  constructor(
    private firestore: AngularFirestore
  ) {

  }

  getCollection(comercioId){
    return 'comercios/'+comercioId+'/calificaciones';
  }

  public create(data:Calificacion) { 
    
    console.log(data);
    const param = JSON.parse(JSON.stringify(data));  
    return this.firestore.collection(this.getCollection(data.comercioId)).add({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public calificarComercio(comercioId,calificacion){
    const sfDocRefC = this.firestore.firestore.collection('comercios/').doc(comercioId);
  
    this.firestore.firestore.runTransaction(transaction => 
      // This code may get re-run multiple times if there are conflicts.
      transaction.get(sfDocRefC)
      .then(sfDoc => {

        let promedioGeneral = 0;
        let cantidadValoraciones =0;

        if(sfDoc.data().promedioGeneral){
          promedioGeneral = ((sfDoc.data().promedioGeneral * sfDoc.data().cantidadValoraciones)+calificacion)/(sfDoc.data().cantidadValoraciones+1)
          cantidadValoraciones = sfDoc.data().cantidadValoraciones +1;
        }else{
          promedioGeneral = calificacion;
          cantidadValoraciones = 1;
        }   
        

        transaction.update(sfDocRefC, { 
          promedioGeneral:  promedioGeneral,
          cantidadValoraciones:  cantidadValoraciones, 
        });
        

      })).then(() => console.log("Transaction successfully committed!"))
    .catch(error => console.log("Transaction failed: ", error));


    
  }

  public calificarProducto(comercioId,productoId,calificacion){

    const sfDocRefP = this.firestore.firestore.collection('comercios/'+comercioId+'/productos/').doc(productoId);
  
    this.firestore.firestore.runTransaction(transaction => 
      // This code may get re-run multiple times if there are conflicts.
      transaction.get(sfDocRefP)
      .then(sfDoc => {

        let promedioGeneral = 0;
        let cantidadValoraciones =0;

        if(sfDoc.data().promedioGeneral){
          promedioGeneral = ((sfDoc.data().promedioGeneral * sfDoc.data().cantidadValoraciones)+calificacion)/(sfDoc.data().cantidadValoraciones+1)
          cantidadValoraciones = sfDoc.data().cantidadValoraciones +1;
        }else{
          promedioGeneral = calificacion;
          cantidadValoraciones = 1;
        }          

        transaction.update(sfDocRefP, { 
          promedioGeneral:  promedioGeneral,
          cantidadValoraciones:  cantidadValoraciones, 
        });
        

      })).then(() => console.log("Transaction successfully committed!"))
    .catch(error => console.log("Transaction failed: ", error));

  }

 

  public get(data:Calificacion) {
    return this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).snapshotChanges();
  }

  public getAll(comercioId){
    return this.firestore.collection(this.getCollection(comercioId)).snapshotChanges();
  }  
}
