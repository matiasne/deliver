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
        this.producto = producto;
        this.producto.id = snap.payload.id;
        prodSubs.unsubscribe();
      })
      comSubs.unsubscribe();
    })
  }

  

  seleccionarOpcion(grupo:GrupoOpciones, opcion:Opcion){
    console.log("seleccionada");
    grupo.opciones.forEach(opcion => {
      opcion.seleccionada = false;
    });
    opcion.seleccionada = true;
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
    if(!this.cantidad){
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
              if(opcion.seleccionada)
                cantidad++
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
      this.producto.cantidad = this.cantidad;
      this.producto.comentario = this.comentario;
      this.pedidoActualService.addProduct(this.comercio,this.producto);
  
      this.toastService.mensajeVerde('Agregado!', this.cantidad+' de '+this.producto.nombre);
      this.navCtrl.back();
    }

   
  }

  sumarCantidad(){
    this.cantidad +=1;
  }

  restarCantidad(){
    this.cantidad-=1;
    if(this.cantidad < 0){
      this.cantidad = 0;
    }
  }
 


}

