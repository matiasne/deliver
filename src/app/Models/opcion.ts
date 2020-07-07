export class Opcion{
    id="";
    nombre="";
    precioVariacion=0;  
    habilitado=true;    
    seleccionada = false;  
  
	constructor(){
        
    }

    public asignarValores(init?: Partial<Opcion>) {
        Object.assign(this, init);
    }
}