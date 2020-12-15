export class PedidoParticular{
    public id ="";
    public desde = {
        direccion:"",
        piso:"",
        puerta:"",
        geopoint:{
            latitude:0,
            longitude:0
        }
    };
    public hasta ={
        direccion:"",
        piso:"",
        puerta:"",
        geopoint:{
            latitude:0,
            longitude:0
        }
    };
    public costoEnvio = 0;
    public comentario = "";
    public remitente={
        nombre:"",
        telefono:""
    };
    public estado = "";
    public cadete = "";


    
	constructor(
		
		){
            this.estado = "pendiente";
            this.cadete = "deliver.almafuerte@gmail.com"
    }
    
    public asignarValores(init?: Partial<PedidoParticular>) {
        Object.assign(this, init);
    }
}