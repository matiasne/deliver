import { GrupoOpciones } from './grupoOpciones';
import { OpcionSeleccionada } from './opcionSeleccionada';

export class Producto{
    public id="";
    public nombre="";
    public stock=0;
    public precio=0;
    public promocion=0;
    public code="";
    public provider_id=0;
    public category=0;
    public description="";
    public icon="";
    public portada="";
    public cantidad =1;
    public comentario="";
    public gruposOpciones:GrupoOpciones[];
    public opcionesSeleccionadas:OpcionSeleccionada[];
    public precioTotal =0;

	constructor(
		
		){
            this.gruposOpciones = [];
            this.opcionesSeleccionadas = [];
    }
    
    public asignarValores(init?: Partial<Producto>) {
        Object.assign(this, init);
    }
}