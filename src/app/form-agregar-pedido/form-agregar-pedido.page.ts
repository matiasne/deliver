import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavController } from '@ionic/angular';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../Models/producto';
import { PedidoService } from '../services/global/pedido.service';
import { ComerciosService } from '../services/comercios.service';
import { ActivatedRoute } from '@angular/router';
import { Comercio } from '../Models/comercio';
import { GrupoOpcionesService } from '../services/grupo-opciones.service';
import { Opcion } from '../Models/opcion';
import { GrupoOpciones } from '../Models/grupoOpciones';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-form-agregar-pedido',
  templateUrl: './form-agregar-pedido.page.html',
  styleUrls: ['./form-agregar-pedido.page.scss'],
})
export class FormAgregarPedidoPage implements OnInit {

  public producto:Producto;
  public comercio:Comercio;
  public comentario:string = "";
  public cantidad:number = 1;

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public pedidoActualService:PedidoService,
    public productosServices:ProductosService,
    public comerciosServices:ComerciosService,
    public route:ActivatedRoute,
    private navCtrl: NavController,
    public grupoOpcionesService:GrupoOpcionesService,
    private toastService:ToastService
  ) { 
    this.comercio = new Comercio();
    this.producto = new Producto();
  }

  ngOnInit() {

   

    var comSubs = this.comerciosServices.getCommerce(this.route.snapshot.params.comercioId).subscribe(snap=>{
      var comercio:any = snap.payload.data();
      this.comercio = comercio;
      this.comercio.id = snap.payload.id;
      
      var prodSubs = this.productosServices.get(this.route.snapshot.params.productoId).subscribe(snap=>{
        var producto:any = snap.payload.data();
        this.producto.asignarValores(producto);
        
        this.producto.id = snap.payload.id;
        this.producto.cantidad = 1;
        //this.producto.precioTotal = this.producto.precio;




        this.producto.precioTotal = this.producto.precio;

        if(this.producto.promocion){
          this.producto.precioTotal = this.producto.promocion;
        }
        

        this.producto.gruposOpciones.forEach(grupo=>{
          grupo.opciones.forEach(opcion =>{
            opcion.cantidad = 0;
          })
        })

        prodSubs.unsubscribe();
      })
      comSubs.unsubscribe();
    })
  }

  

  seleccionarOpcion(grupo:GrupoOpciones, opcion:Opcion){
    console.log("seleccionada");
    grupo.opciones.forEach(opcion => {
      opcion.seleccionada = false;
      opcion.cantidad = 0;
    });
    opcion.seleccionada = true;
    opcion.cantidad = 1;
  }

  seleccionarOpcionCheck(grupo:GrupoOpciones, opcion:Opcion){
    if(opcion.seleccionada){
      opcion.seleccionada = false;
    }
    else{
      opcion.seleccionada = true;
    }
  }

  cancelar(){
    this.navCtrl.back();
  }

  agregar(){
    //Aca llama al servicio global de pedido y le carga el pedido
    if(!this.producto.cantidad){
      this.toastService.alert("Por favor ingrese la cantidad","Debe ser al menos 1");
      return;
    }

    var isOk = false;
   
    if(this.producto.gruposOpciones.length > 0){
      
      console.log("validando")
      for (var i = 0; i < this.producto.gruposOpciones.length; ++i){
        let grupo = this.producto.gruposOpciones[i]
                
        if(grupo.minimo > 0){

          if(grupo.maximo == 1){
            grupo.opciones.forEach(opcion =>{
              if(opcion.seleccionada)
                isOk = true;
            })
          }
  
          if(grupo.maximo > 1){
            var cantidad = 0;
            console.log(grupo)
            grupo.opciones.forEach(opcion =>{
              if(opcion.cantidad)
                cantidad += opcion.cantidad;
            })
            console.log(cantidad)
            if(cantidad >= grupo.minimo){
              isOk = true;
            }

            if(cantidad > grupo.maximo){
              isOk = false;
            }
          }
        }
        else{
          isOk = true;
        }
  
        if(!isOk){
          this.toastService.alert("Selecciona una opcion del producto", "Seleccione "+ grupo.minimo+" "+grupo.nombre);
          isOk = false;
          break;
        }
        
      }
      
    }
    else{
      isOk = true;
    }
   
    console.log("!!!!!! isOK"+isOk)
    if(isOk){
      this.producto.comentario = this.comentario;
      this.pedidoActualService.addProduct(this.comercio,this.producto);
  
      this.toastService.mensajeVerde('Agregado!', this.producto.cantidad+' de '+this.producto.nombre);
      this.navCtrl.back();
    }

   
  }

  sumarCantidad(){
    this.producto.cantidad +=1;
    let precioViejo = this.producto.precioTotal;
    this.producto.precioTotal = this.valorTotal();

  }

  restarCantidad(){ 
    this.producto.cantidad-=1;
    if(this.producto.cantidad < 1){
      this.producto.cantidad = 1;
      return;
    }   
    
   
        this.producto.precioTotal = this.valorTotal();

  }

  valorTotal(){
    let valorUno = this.producto.precio;
    
    if(this.producto.promocion){
      valorUno = Number(this.producto.promocion);
    }
   
    this.producto.gruposOpciones.forEach(grupos =>{
      grupos.opciones.forEach (opcion =>{
        if(opcion.seleccionada || opcion.cantidad > 0)
          valorUno += Number(opcion.precioVariacion * opcion.cantidad);
      })
    });
    console.log(this.producto.cantidad+" "+valorUno)
    return this.producto.cantidad * valorUno;
  }

  restarCantidadOpcion(grupoIndex,i){
    if(!this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad){
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad = 0;
    }

    if(!this.producto.gruposOpciones[grupoIndex].cantidadTotal){
      this.producto.gruposOpciones[grupoIndex].cantidadTotal = 0;
    }   

    if(this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad <= 0){
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad = 0;
    }
    else{
      
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad -=1;
      this.producto.gruposOpciones[grupoIndex].cantidadTotal -=1;      
    }

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal < 0){
      this.producto.gruposOpciones[grupoIndex].cantidadTotal = 0;
    }

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal >= this.producto.gruposOpciones[grupoIndex].maximo){
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = true;
    }
    else{
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = false;
    }    

    this.producto.precioTotal = this.valorTotal();
    
    

    

   
  }

  sumarCantidadOpcion(grupoIndex,i){

    if(!this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad){
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad = 0;
    }

    if(!this.producto.gruposOpciones[grupoIndex].cantidadTotal){
      this.producto.gruposOpciones[grupoIndex].cantidadTotal = 0;
    }      

    this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad +=1;
    this.producto.gruposOpciones[grupoIndex].cantidadTotal +=1;

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal >= this.producto.gruposOpciones[grupoIndex].maximo){
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = true;
    }
    else{
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = false;
    }

    if(this.producto.gruposOpciones[grupoIndex].opciones[i].precioVariacion){
        
    }

    let precioViejo = this.producto.precioTotal;
    this.producto.precioTotal = this.valorTotal();

    console.log(this.producto.gruposOpciones[grupoIndex].maximo)
    console.log(this.producto.gruposOpciones[grupoIndex].cantidadTotal)
    console.log(this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad)
  }



 

}

