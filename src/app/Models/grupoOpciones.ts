import { Opcion } from './opcion';

export class GrupoOpciones{
    public productoId="";

    public id ="";
    public nombre="";
    public habilitado="true";
    public minimo=0;
    public maximo=0;
    public opciones:Opcion[];

    public seleccionadas:Opcion[];

	constructor(){
        this.opciones = [];
        this.seleccionadas = [];
    }
    
    public asignarValores(init?: Partial<GrupoOpciones>) {
        Object.assign(this, init);
    }
}