export class Rol{
    public id="";
    public estado ="";
    public comercioId="";
    public user_email=""; 
    public rol="";

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Rol>) {
        Object.assign(this, init);
    }
}