export class OpcionSeleccionada{
    public nombreGrupo ="";
    public nombre="";
    public precioVariacion=0;  

	constructor(){
        
    }

    public asignarValores(init?: Partial<OpcionSeleccionada>) {
        Object.assign(this, init);
    }
}