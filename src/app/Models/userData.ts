export class UserData{
    public uid="";
    public displayName="";
    public email="";
    public photoURL="";
    public telefono ="";
    public direccion="";
    public  address={
        pais:"",
        localidad:"",
        calleNombre:"",
        calleNumero:"",
        piso:"",
        puerta:"",
        provincia:""
    };
    public posicion = {      
        geohash:"",
        geopoint:{
            Latitude:"",
            Longitude:""
        }

    };

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<UserData>) {
        Object.assign(this, init);
    }
}