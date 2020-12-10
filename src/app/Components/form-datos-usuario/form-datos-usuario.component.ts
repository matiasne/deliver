import { Component, OnInit, EventEmitter, Output } from '@angular/core';
declare var google: any;
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { UserData } from '../../Models/userData';

@Component({
  selector: 'app-form-datos-usuario',
  templateUrl: './form-datos-usuario.component.html',
  styleUrls: ['./form-datos-usuario.component.scss'],
})
export class FormDatosUsuarioComponent implements OnInit {

  @Output() onSelectValue = new EventEmitter<UserData>();
  
  public map: any;
  public geo:any;

  public autocomplete:any;
  public place:any;
  public markers:any =[];

  public geocoder:any;  

  public user:UserData;

  constructor(
    private authService:AuthService,
    private toastController:ToastController,
    private router:Router
  ) { 
    this.user = new UserData();
    this.geo = geofirex.init(firebase);
  }

  ngOnInit() {         
      this.onSelectValue.emit(this.user);
      this.user.asignarValores(JSON.parse(localStorage.getItem('user')));
      console.log(this.user)    
      setTimeout(() => {           
        this.initAutocomplete('pac-input');     
      }, 3000);  
      
      this.geocoder = new google.maps.Geocoder();

      this.initMap("mapUser",{
        center:{
          lat:Number(this.user.posicion.geopoint.latitude), 
          lng:Number(this.user.posicion.geopoint.longitude)
        },
        zoom:15 ,
        options: {
          disableDefaultUI: true,
          scrollwheel: true,
          streetViewControl: false,
        },    
      });

      let position = {lat: Number(this.user.posicion.geopoint.latitude), lng: Number(this.user.posicion.geopoint.longitude)};

      var marker = this.makeMarker({
        position: position,
        map: this.map,
        title: 'Mi dirección',
        draggable:true,
      });

      this.onChange();

  }

  ionViewDidEnter(){
    
  }

  onChange() {
    this.onSelectValue.emit(this.user);
  }

 
  
  async alertToast(message) {

    console.log("!!!!!!")
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: "danger"
    });
    toast.present();
  }

  atras(){
    if(localStorage.getItem('comercioUnico')){
      this.router.navigate(['/details-comercio',{
        id:localStorage.getItem('comercioUnicoId'),
        enLocal:localStorage.getItem('enLocal'),
        comercioUnico:localStorage.getItem('comercioUnico'),
      }]);
    }
    else{
      this.router.navigate(['/home']);
    }
  }

  
  initMap(el, options) {
    this.map = this.makeMap(el, options)

    var markerOptions = {
        draggable: true,
        map: this.map,
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

  
  initAutocomplete(el = "autocomplete", options = { types: ["geocode"], componentRestrictions: { country: "ar" }}, fields = ["address_components", "geometry", "icon", "name"]) {
    // Create the autocomplete object, restricting the search predictions to geographical location types.
    this.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(el).getElementsByTagName('input')[0], options
    )
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // Set the data fields to return when the user selects a place.
    this.autocomplete.setFields(fields)

    if (this.map) {
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        this.autocomplete.bindTo("bounds", this.map)
    }

    this.autocomplete.addListener("place_changed",() => {
      console.log("place_changed");
      this.place = this.autocomplete.getPlace()
      console.log(this.place);

      this.user.posicion = this.geo.point(this.place.geometry.location.lat(), this.place.geometry.location.lng());
      //this.user.posicion.geopoint.latitude = this.place.geometry.location.lat();
      //this.user.posicion.geopoint.longitude = this.place.geometry.location.lng();

      var marker = this.makeMarker({
        position: {lat: Number(this.place.geometry.location.lat()), lng: Number(this.place.geometry.location.lng())},
        map: this.map,
        title: 'Hello World!',
        draggable:true,
      });

      var bounds = new google.maps.LatLngBounds();      
      bounds.extend(marker.getPosition());
      this.map.fitBounds(bounds);

      var zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function(event) {
        if ( this.getZoom() ){   // or set a minimum
            this.setZoom(16);  // set zoom here
        }
      });

      setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);

     // this.fillInAddressForm(this.place.address_components);
      this.onChange();

      setTimeout(function () {
        document.getElementById('pac-input').click();
      }, 2500);
    
    });

  }



  makeMarker(options) {
    this.markers.forEach(element => {
      element.setMap(null);
    });
    var marker = new google.maps.Marker(options)
    this.markers.push(marker)
    return marker
  }
}

