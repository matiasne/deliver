import { Injectable } from '@angular/core';
import { Pedido } from 'src/app/Models/pedido';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';
import { OpcionSeleccionada } from 'src/app/Models/opcionSeleccionada';
import * as firebase from 'firebase';
import { ComerciosService } from '../comercios.service';
import { NotificacionesService } from '../notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private pedidoActual:Pedido = new Pedido();

  public actualPedidoSubject = new BehaviorSubject<Pedido>(this.pedidoActual);

  public pedidoCalificando:Pedido = new Pedido();

  constructor(
    private firestore: AngularFirestore,
    private auth:AuthService,
    private comerciosService:ComerciosService,
    private notificacionesService:NotificacionesService
  ) {
    this.pedidoActual = new Pedido();
    this.pedidoActual.on = false;
   }

   public getActualSaleSubs(){
    return this.actualPedidoSubject.asObservable();
    }

  public setClienteNombre(nombre){
    this.pedidoActual.setClientName(nombre);
    this.pedidoActual.on = true;
    this.actualPedidoSubject.next(this.pedidoActual);    
  }

  public setClienteTelefono(phone){
    this.pedidoActual.setPhone(phone);
    this.pedidoActual.on = true;
    this.actualPedidoSubject.next(this.pedidoActual);    
  }

  public setPosition(position){
    this.pedidoActual.setPosition(position);
    this.pedidoActual.on = true;
    this.actualPedidoSubject.next(this.pedidoActual);    
  }

  public setDireccion(direccion){
    this.pedidoActual.setDireccion(direccion);
    this.pedidoActual.on = true;
    this.actualPedidoSubject.next(this.pedidoActual);    
  }

  public setPiso(piso){
    this.pedidoActual.setPiso(piso);
    this.pedidoActual.on = true;
    this.actualPedidoSubject.next(this.pedidoActual);   
  }

  public setCostoEnvio(costo){
    this.pedidoActual.setCostoEnvio(costo);
    this.pedidoActual.on = true;
    this.actualPedidoSubject.next(this.pedidoActual); 
  }

  public setPuerta(puerta){
    this.pedidoActual.setPuerta(puerta);
    this.pedidoActual.on = true;
    this.actualPedidoSubject.next(this.pedidoActual);   
  }

  public addProduct(comercio,producto){

    producto.gruposOpciones.forEach(grupo =>{
      grupo.opciones.forEach(opcion => {
        if(opcion.seleccionada){

          producto.precio = Number(producto.precio) + Number(opcion.precioVariacion);

          console.log(opcion.precioVariacion)
          console.log(producto.precio)

          var opcionSeleccionada:OpcionSeleccionada = new OpcionSeleccionada();
          opcionSeleccionada.nombreGrupo = grupo.nombre;
          opcionSeleccionada.nombre = opcion.nombre;
          opcionSeleccionada.precioVariacion = opcion.precioVariacion;
        
          producto.opcionesSeleccionadas.push(JSON.parse(JSON.stringify(opcionSeleccionada)));
          console.log(producto);
        }
      });
    });

    producto.keywords = [];
    producto.gruposOpciones =[];
    
    this.pedidoActual.agregarOrden(comercio,producto);
    this.pedidoActual.on = true;
    console.log(this.pedidoActual);
    this.actualPedidoSubject.next(this.pedidoActual);    
  }

  public deleteOrden(comercioIndex, productoIndex){
    this.pedidoActual.eliminarOrden(comercioIndex, productoIndex);
    this.actualPedidoSubject.next(this.pedidoActual); 
  }

  public getAllPendiente(){
    return this.firestore.collection('pedidos', ref => 
    ref.where('estado','<=',1)
     ).snapshotChanges(); 
  }

  public getPedidosCliente(){
    console.log(this.auth.getUID())
    return this.firestore.collection('pedidos', ref => 
      ref.where('clienteId','==',this.auth.getUID())
       ).snapshotChanges();    
  }

  public getPedidoPendienteByCommerce(commerce_id){
    console.log(commerce_id)
    return this.firestore.collection('pedidos', ref => 
      ref.where('comercioId','==',commerce_id).where('estado','<=',3)
       ).snapshotChanges(); 
  }

  public getPedidoChangesByCommerce(commerce_id){
    return this.firestore.collection('pedidos', ref => 
    ref.where('comercioId','==',commerce_id)
     )
    .stateChanges(['modified'])
    .pipe(
        map((actions) => actions.map(a => {
          var data:any = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data;
        }))
    );
  }
  
  public getPedidoChanges(){
    return this.firestore.collection('pedidos', ref => 
    ref.where('clienteId','==',this.auth.getUID())
     )
    .stateChanges(['modified'])
    .pipe(
        map((actions) => actions.map(a => {
            var data:any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
        }))
    );
  }

  public setPedidoRecibido(pedido){
    this.pedidoCalificando = pedido;
    this.firestore.collection("pedidos").doc(pedido.id).update({recibido: 1});
    if(pedido.estado >=3){
      this.borrarPedido(pedido);
    }
  }


  public setPedidoTomado(pedido,minutos){
    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"El pedido ha sido tomado!","Su comercio ya está realizando el pedido");
    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 1, demora: minutos});
  }

  public setPedidoListo(pedido){

    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"El pedido esta listo!","Su comercio ya tiene el pedido listo");

    this.comerciosService.getCommerce(pedido.comercioId).subscribe(snap=>{
      var comercio:any = snap.payload.data();
      
      console.log(comercio.rolCadetes);

      console.log(comercio.rolComandatarios);

      comercio.rolCadetes.forEach(cadeteRolId => {
        this.notificacionesService.enviarByRolId(cadeteRolId,"El pedido esta listo!","Tienes un pedido listo para buscar!");
      });
    })


    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 2});
  }

  public setPedidoEnviado(pedido){
    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 3});
    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"Pedido en Camino","El cadete está llevando su pedido")
    if(pedido.recibido == 1){
      this.borrarPedido(pedido);
    }
  }

  public setPedidoCancelado(pedido){
    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 3});
   
    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"Pedido Cancelado","")

    if(pedido.recibido == 1){
      this.borrarPedido(pedido);
    }
    this.setPedidoNoMostrar(pedido);
  }

  public setPedidoNoMostrar(pedido){
    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 4});
  }

  public borrarPedido(pedido){
    this.firestore.collection("pedidos").doc(pedido.id).delete();
  }

 

  

  public save(){      

    let porWhatsapp =  localStorage.getItem('porWhatsapp');
      
    this.pedidoActual.ordenes.forEach(orden => {
      
        console.log(orden)
        orden.costoEnvio = this.pedidoActual.costoEnvio;
        orden.clienteDireccion= this.pedidoActual.cliente.direccion;
        orden.clientePiso= this.pedidoActual.cliente.piso;
        orden.clientePuerta= this.pedidoActual.cliente.puerta;
        orden.clientePosicion= this.pedidoActual.cliente.posicion;
        orden.clienteId = this.auth.getUID();
        if(orden.clienteId == null)
          orden.clienteId ="";
        orden.clienteTelefono= this.pedidoActual.cliente.telefono;
        orden.clienteNombre= this.pedidoActual.cliente.nombre;
        orden.estado= this.pedidoActual.estado;   
        orden.recibido = "0";   
        orden.demora = "0";

        console.log(orden.comercioId); 

        let telefono = "";
        
        this.comerciosService.getCommerce(orden.comercioId).subscribe(snap=>{
          var comercio:any = snap.payload.data();
          
          telefono = comercio.telefono;

          console.log(comercio);

          console.log(comercio.rolComandatarios);

          comercio.rolCadetes.forEach(cadeteRolId => {
            this.notificacionesService.enviarByRolId(cadeteRolId,"Nuevo Pedido para Buscar","Se ha realizado un nuevo pedido!");
          });

          comercio.rolComandatarios.forEach(comandatarioRolId => {
            this.notificacionesService.enviarByRolId(comandatarioRolId,"Nuevo Pedido a Realizar","Se ha realizado un nuevo pedido!");
          });

          

          if(porWhatsapp == "true"){
            
            let text = this.armarTexto(orden,this.pedidoActual);

            console.log(telefono);
            console.log(text);
            var  element = document.createElement('a') as HTMLElement;
            element.setAttribute('href', 'https://wa.me/'+telefono+'?text='+text);
            element.setAttribute('style', 'display:none;');
            element.click();
          }
        })

       
        if(porWhatsapp == "false" || porWhatsapp == undefined){
          this.firestore.collection('pedidos').add({...Object.assign({}, orden),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
        
    });     
    
    this.pedidoActual = new Pedido();
    this.actualPedidoSubject.next(this.pedidoActual);   
    
  }

  armarTexto(orden,pedidoActual){
    let texto = "* Quiero: ";

    console.log(orden)
    console.log(pedidoActual)
    orden.productos.forEach(producto => {
      texto += producto.cantidad+" de "+producto.nombre+", \n";

      producto.opcionesSeleccionadas.forEach(opcion => {
        texto += "opcion: "+opcion.nombre+" \n" 
      });

      if(producto.comentario != "")
        texto +=" Ademas: "+producto.comentario;      
    });

    texto+="* Total del pedido: "+orden.total+" \n";

    texto+="* Enviar a: "+orden.clienteDireccion;

    if(orden.clientePiso != "")
      texto +=" Piso:"+orden.clientePiso+" Puerta: "+orden.clientePuerta;

    texto+="* Mi nombre es: "+orden.clienteNombre+" \n";

    return texto;
  }
}
