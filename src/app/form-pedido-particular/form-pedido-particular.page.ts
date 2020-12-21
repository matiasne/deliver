import { Component, OnInit } from '@angular/core';
import { PedidoParticular } from '../Models/pedidoParticular';
declare var google: any;
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { NavController } from '@ionic/angular';
import { PedidoEspecialService } from '../services/pedido-especial.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-form-pedido-particular',
  templateUrl: './form-pedido-particular.page.html',
  styleUrls: ['./form-pedido-particular.page.scss'],
})
export class FormPedidoParticularPage implements OnInit {

  public direccionHasta = "";

  public pedido:PedidoParticular;

  public mapDesde: any;
  public mapHasta: any;
  public geo:any;

  public autocompleteDesde:any;
  public autocompleteHasta:any;
  public place:any;
  public markers:any =[];

  public geocoder:any;  


  public distancia = 0;


  constructor(
    public navCtrl:NavController,
    public pedidosParticularesService:PedidoEspecialService,
    private auth:AuthService
  ) { 

    this.pedido = new PedidoParticular();

    this.geo = geofirex.init(firebase);
  }

  ngOnInit() {

    
    setTimeout(() => {           
      this.initAutocompleteDesde('pac-input-desde'); 
      this.initAutocompleteHasta('pac-input-hasta');     
    }, 3000);  
    
    this.geocoder = new google.maps.Geocoder();

    this.initMapDesde("mapDesde",{
      center:{
        lat:Number(0), 
        lng:Number(0)
      },
      zoom:15 ,
      options: {
        disableDefaultUI: true,
        scrollwheel: true,
        streetViewControl: false,
      },    
    });

    let position = {lat: Number(0), lng: Number(0)};

    var marker = this.makeMarker({
      position: position,
      map: this.mapDesde,
      title: 'Mi dirección',
      draggable:true,
    });


    this.initMapHasta("mapHasta",{
      center:{
        lat:Number(0), 
        lng:Number(0)
      },
      zoom:15 ,
      options: {
        disableDefaultUI: true,
        scrollwheel: true,
        streetViewControl: false,
      },    
    });

  


  }

  ionViewDidEnter(){

  }

  
  
  initMapDesde(el, options) {
    this.mapDesde = this.makeMap(el, options)

    var markerOptions = {
        draggable: true,
        map: this.mapDesde,
        position: options.center,
        zoom:5 ,
    }    
  }

  initMapHasta(el, options) {
    this.mapHasta = this.makeMap(el, options)

    var markerOptions = {
        draggable: true,
        map: this.mapHasta,
        position: options.center,
        zoom:5 ,
    }    
  }

  makeMap(el, options) {
    
    if(google){
      console.log(el);
      let mapEle: HTMLElement = document.getElementById(el);
      console.log(mapEle);
      return new google.maps.Map(mapEle, options)
    }
    
  }


  makeMarker(options) {
    this.markers.forEach(element => {
      element.setMap(null);
    });
    var marker = new google.maps.Marker(options)
    this.markers.push(marker)
    return marker
  }

  initAutocompleteDesde(el = "autocomplete", options = { types: ["geocode"], componentRestrictions: { country: "ar" }}, fields = ["address_components", "geometry", "icon", "name"]) {
    // Create the autocomplete object, restricting the search predictions to geographical location types.
    this.autocompleteDesde = new google.maps.places.Autocomplete(
        document.getElementById(el).getElementsByTagName('input')[0], options
    )
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // Set the data fields to return when the user selects a place.
    this.autocompleteDesde.setFields(fields)

    if (this.mapDesde) {
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        this.autocompleteDesde.bindTo("bounds", this.mapDesde)
    }

    this.autocompleteDesde.addListener("place_changed",() => {

      console.log("place_changed");
      this.place = this.autocompleteDesde.getPlace()
      console.log(this.place);

      this.pedido.desde = this.geo.point(this.place.geometry.location.lat(), this.place.geometry.location.lng());
      //this.user.posicion.geopoint.latitude = this.place.geometry.location.lat();
      //this.user.posicion.geopoint.longitude = this.place.geometry.location.lng();

      var marker = this.makeMarker({
        position: {lat: Number(this.place.geometry.location.lat()), lng: Number(this.place.geometry.location.lng())},
        map: this.mapDesde,
        title: 'Hello World!',
        draggable:true,
      });

      var bounds = new google.maps.LatLngBounds();      
      bounds.extend(marker.getPosition());
      this.mapDesde.fitBounds(bounds);

      var zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.mapDesde, 'bounds_changed', function(event) {
        if ( this.getZoom() ){   // or set a minimum
            this.setZoom(16);  // set zoom here
        }
      });

      console.log(this.pedido)

      setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);


      setTimeout(function () {
        document.getElementById('pac-input-desde').click();
      }, 2500);
    
    });

  }


  initAutocompleteHasta(el = "autocomplete", options = { types: ["geocode"], componentRestrictions: { country: "ar" }}, fields = ["address_components", "geometry", "icon", "name"]) {
    // Create the autocomplete object, restricting the search predictions to geographical location types.
    this.autocompleteHasta= new google.maps.places.Autocomplete(
        document.getElementById(el).getElementsByTagName('input')[0], options
    )
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // Set the data fields to return when the user selects a place.
    this.autocompleteHasta.setFields(fields)

    if (this.mapHasta) {
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        this.autocompleteHasta.bindTo("bounds", this.mapHasta)
    }

    this.autocompleteHasta.addListener("place_changed",() => {

      console.log(this.direccionHasta)
      this.pedido.hasta.direccion = this.direccionHasta;
      console.log("place_changed");
      this.place = this.autocompleteHasta.getPlace()
      console.log(this.place);

      this.pedido.hasta.geopoint = this.geo.point(this.place.geometry.location.lat(), this.place.geometry.location.lng());
      //this.user.posicion.geopoint.latitude = this.place.geometry.location.lat();
      //this.user.posicion.geopoint.longitude = this.place.geometry.location.lng();

      var marker = this.makeMarker({
        position: {lat: Number(this.place.geometry.location.lat()), lng: Number(this.place.geometry.location.lng())},
        map: this.mapHasta,
        title: 'Hello World!',
        draggable:true,
      });

      var bounds = new google.maps.LatLngBounds();      
      bounds.extend(marker.getPosition());
      this.mapHasta.fitBounds(bounds);

      var zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.mapHasta, 'bounds_changed', function(event) {
        if ( this.getZoom() ){   // or set a minimum
            this.setZoom(16);  // set zoom here
        }
      });

      
      console.log(this.pedido)

      setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);


      setTimeout(function () {
        document.getElementById('pac-input-hasta').click();
      }, 2500);
    
    });

  }

  setCosto(){

    const geo = geofirex.init(firebase);
    this.pedido.costoEnvio = 0;
    if(this.pedido.desde.geopoint.latitude !=0 && this.pedido.hasta.geopoint.longitude){
      this.distancia = Number(geo.distance(geo.point(this.pedido.desde.geopoint.latitude, this.pedido.desde.geopoint.longitude), geo.point(this.pedido.hasta.geopoint.latitude, this.pedido.hasta.geopoint.longitude)).toFixed(2))
      console.log("distancia: ")
      console.log(this.distancia);
      if(this.distancia > 0 && this.distancia <= 1.6) {
        console.log(80)
         this.pedido.costoEnvio = 80;
      }  
      if(this.distancia > 1.6 && this.distancia <= 2) {
        console.log(90)
         this.pedido.costoEnvio = 90;
      }  
      if(this.distancia > 2 && this.distancia <= 3) {
        console.log(100)
         this.pedido.costoEnvio = 10;
      }  
      if(this.distancia > 3 && this.distancia <= 4) {
        console.log(120)
         this.pedido.costoEnvio = 120;
      }  
      if(this.distancia > 4 && this.distancia <= 5) {
        console.log(130)
         this.pedido.costoEnvio = 130;
      }  
      
      if(this.distancia > 5){
        console.log(200)
         this.pedido.costoEnvio = 200;
      }
    }
  }


  cancelar(){
    this.navCtrl.back();
  }

  guardar(){

    this.pedido.remitenteId = this.auth.getActualUser().uid;

    console.log(this.pedido);

    this.pedidosParticularesService.create(this.pedido).then(data =>{
      console.log(data);
      this.navCtrl.back();
    },err=>{
      console.log(err);
    });
  }



}
