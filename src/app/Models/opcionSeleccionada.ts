export class OpcionSeleccionada{
    public nombreGrupo ="";
    public nombre="";
    public cantidad = 0;
    public precioVariacion=0;  

	constructor(){
        
    }

    public asignarValores(init?: Partial<OpcionSeleccionada>) {
        Object.assign(this, init);
    }
}