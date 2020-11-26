import { Producto } from './producto';
import { Comercio } from './comercio';

export class Pedido{

    public comercioId ="";
    
    public on = false;
    public cliente = {
        id:"",
        nombre:"",
        posicion:"",
        telefono:"",
        direccion:"",
        piso:"",
        puerta:""
    }
   
    public estado = 0;
    public recibido = 0;
    public comercio_nomostrar = 0;
    public cantidadTotal = 0;
    public total:number = 0;
    public ordenes:any = [];  
    public productos =[]; 
    public costoEnvio = 0;
    
	constructor(){
    }

    public setCostoEnvio(costo){
        this.costoEnvio = costo;
    }

    public setClientName(name){
        this.cliente.nombre = name;
    }

    public setPosition(posicion){
        this.cliente.posicion = posicion;
    }

    public setDireccion(direccion){
        this.cliente.direccion = direccion;
    }

    public setPiso(piso){
        this.cliente.piso = piso;
    }

    public setPuerta(puerta){
        this.cliente.puerta = puerta;
    }
    public setPhone(phone){
        this.cliente.telefono = phone;
    }

    public eliminarOrden(comercioIndex,Productoindex){
        var totalARestar = 0;
        var cantidadMenos= 0;

        var producto = this.ordenes[comercioIndex].productos[Productoindex];
        totalARestar += producto.precioTotal;
        cantidadMenos += producto.cantidad;
        
        this.cantidadTotal -= cantidadMenos;

        this.total -= totalARestar;

        this.ordenes[comercioIndex].productos.splice(Productoindex,1);  

        console.log(this.ordenes);

        this.ordenes[comercioIndex].total -= totalARestar;

        if(this.ordenes[comercioIndex].total == 0){           
            this.ordenes.splice(comercioIndex,1);
        }
        
       

        if(this.cantidadTotal == 0){
            this.on = false;
        }
    }
    
    public agregarOrden(comercio,producto){
        //Aca revisar si el comercio ya está en ordenes y sumarle a productos de ser así
        comercio.icon = "";
        comercio.portada ="";        
        var agregado = false;
        this.cantidadTotal += producto.cantidad;

        this.total += Number(producto.precioTotal);

        this.ordenes.forEach((orden, index)  =>{
            
                if(orden.comercioId == comercio.id){               
                 
                    let objCopy = Object.assign({}, producto);
                    delete objCopy.foto;
                    orden.productos.push(objCopy);                    
                    agregado = true;
                }
                      
        });

        if(!agregado){
            let prodCopy = Object.assign({}, producto);
            prodCopy.portada ="";                    
            
            console.log(comercio)
            var o = {
                comercioId: comercio.id,
                comercioNombre: comercio.nombre,
                comercioTelefono: comercio.telefono,
                comercioDireccion: comercio.direccion,
                comercioPosicion: comercio.posicion,
                productos: [prodCopy],   
                total:this.total      
            }
            
            this.ordenes.push(o);
        }
    }
}