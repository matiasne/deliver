export class Posicion{
    
    direccion:"";
    geohash:"";
    geopoint:{
        Latitude:"",
        Longitude:""
    }
     

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Posicion>) {
        Object.assign(this, init);
    }
}