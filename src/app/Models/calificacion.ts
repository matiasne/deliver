export class Calificacion{
    id="";
    velocidad=0;
    producto=0;
    servicio=0;
    comentario="";  
    usuarioId="";    
    comercioId = "";  
    productoId = "";  
  
	constructor(){
        
    }

    public asignarValores(init?: Partial<Calificacion>) {
        Object.assign(this, init);
    }
}