export class Comercio{
    public id="";
	public address="";
	public description="";
	public email="";
	
	public latitud="";
	public longitud="";
	public telefono="";
	
	public nombre="";
	public icon="";
	public portada: any;
	public direccion:"";

	public pais:"";
    public localidad:"";
    public calleNombre:"";
    public calleNumero:"";
    public puerta:"";
    public numero:"";
	public provincia:"";
	
  	public position = {        
        geohash:"",
        geopoint:{
            Ic:"",
            wc:""
        }
    };
	public category_id: any;
	public horarios:any=[];
	public serviceCategories:any=[];
	public productCategories:any=[];

	constructor(
		
		){
	}
}