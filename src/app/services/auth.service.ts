import { Injectable, NgZone } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { UserData } from '../Models/userData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private webClientId= "304287906727-vo9q6hparl0spvhnbn19mfaojuuatqb1.apps.googleusercontent.com";
  
 

  authenticationState = new BehaviorSubject(false);

  public userSubject = new BehaviorSubject <any>("");

  
  constructor(
    public firebaseAuth: AngularFireAuth,
    private platform: Platform,
    public alertController: AlertController,
    public googlePlus:GooglePlus,
    private ngZone:NgZone,
    private router: Router,
    public toastController: ToastController,
    private afs: AngularFirestore,
  ) { 

    this.platform.ready().then(() => {
      this.checkToken();
    });

  }

  checkToken() {
    
    var user:any = JSON.parse(localStorage.getItem('user'));
   
    if (user && user.uid) {
      this.authenticationState.next(true);
      this.userSubject.next(JSON.parse(localStorage.getItem('user')));
    }    
  } 

  getActualUserObservable(): Observable<any>{
    return this.userSubject.asObservable();
  }
  

  login(email: string, password: string) {
    
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {        
        this.updateUserData(value.user);      
        return true;           
      })
      .catch(async err => {
       
        console.log('Something went wrong:',err.message);

        if(err.message ==  "The email address is badly formatted."){
         /* this.toastr.info('El Email ingresado no tiene un formato valido','Error al ingresar Email', {
            timeOut: 5000,
          });*/ 
          const toast = await this.toastController.create({
            message: 'El Email ingresado no tiene un formato valido',
            duration: 2000,
            position:'top',
            color:"danger"
          });
          toast.present();
          
          return false;
        }

        if(err.message ==  "The password is invalid or the user does not have a password."){
         /* this.toastr.info('El password ingresado no es correcto','Password Incorrecto', {
            timeOut: 5000,
          });*/
          const toast = await this.toastController.create({
            message: 'El password ingresado no es correcto',
            duration: 2000,
            position:'top',
            color:"danger"
          });
          toast.present();
          return false
        }

        if(err.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
          /*this.toastr.info('El usuario ingresado no existe','Usuario no encontrado', {
            timeOut: 5000,
          });*/
          const toast = await this.toastController.create({
            message: 'El usuario ingresado no existe',
            duration: 2000,
            position:'top',
            color:"danger"
          });
          toast.present();
          return false
        }
       
    });
  }

  resetPassword(email: string) {
    var auth = this.firebaseAuth.auth;
    return auth.sendPasswordResetEmail(email)
      .then(async () => {
       
        const toast = await this.toastController.create({
          message: 'Te hemos enviado un mail para que puedas reiniciar tu password',
          duration: 2000,
          position:'top',
          color:"primary"
        });
        toast.present();
        this.router.navigate(['/login']);
      })
      .catch(async (error) => {
        console.log(error.message);       

        if(error.message ==  "The email address is badly formatted."){
          
          const toast = await this.toastController.create({
            message: 'El Email ingresado no tiene un formato valido',
            duration: 5000,
            position: 'top',
            color:"danger"
          });
          toast.present();
        }

        if(error.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
         
          const toast = await this.toastController.create({
            message: 'El Email ingresado no se encuentra registrado',
            duration: 5000,
            position: 'top',
            color:"danger"
          });
          toast.present();
        }

      })
  }

  setFCMToken(token){
    const userRef: AngularFirestoreDocument = this.afs.doc('users/'+this.getUID());
    const data = { 
      notification_token: token, 
    }    
    return userRef.set(data, { merge: true });
  }

  updateUserData(user){
    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${user.uid}`);
    const data = { 
      uid: user.uid, 
      email: user.email, 
      displayName: user.displayName, 
      photoURL: user.photoURL,
    }    

    localStorage.setItem('user',JSON.stringify(user));
    localStorage.setItem('rol',null);
    localStorage.setItem('comercio_seleccionadoId',null);
    this.authenticationState.next(true); 
    this.userSubject.next(user);
    return userRef.set(data, { merge: true });
  }

  public updateLocalUserData(user){

    const data = { 
      uid: user.uid, 
      email: user.email, 
      displayName: user.displayName, 
      photoURL: user.photoURL,
      direccion:user.direccion,
      posicion:user.posicion,
      address:user.address,
      telefono:user.telefono
    }    

    localStorage.setItem('user',JSON.stringify(data));
  }

  public updateGPSUSer(lat,lng){
    const data = {
      lat:lat,
      lng:lng
    }
    localStorage.setItem('userGPS',JSON.stringify(data));
  }

  public getGPSUser(){
    return localStorage.getItem('userGPS');
  }

  addUserData(user:UserData){
    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${user.uid}`);
    return userRef.set(user, { merge: true });
  }

  setRol(rol){
    localStorage.setItem('rol',JSON.stringify(rol));
  }

  getRol(){
    return localStorage.getItem('rol');
  }

  signup(email,password) {
    
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => { 
            
        
        this.ngZone.run(async () => {
          
          this.updateUserData(result.user);

          const toast = await this.toastController.create({
            message: 'Usuario creador correctamente. Bienvenido!',
            duration: 5000,
            position: 'top',
            color: "primary"
          });
          toast.present();
        });
      }).catch(async (error) => {
       console.log(error.message);

       if(error.message ==  "The email address is already in use by another account."){
          
        const toast = await this.toastController.create({
          message: 'El mail ingresado ya se encuentra registrado',
          duration: 5000,
          position: 'top',
          color:"danger"
        });
        toast.present();
        
      }

        if(error.message ==  "Password should be at least 6 characters"){
          
          const toast = await this.toastController.create({
            message: 'La contraseña debe contener al menos 6 caracteres',
            duration: 5000,
            position: 'top',
            color: "danger"
          });
          toast.present();      
        }

        if(error.message ==  "The email address is badly formatted."){
         
          const toast = await this.toastController.create({
            message: 'El Email ingresado no tiene un formato valido',
            duration: 5000,
            position: 'top',
            color: "danger"
          });
          toast.present(); 
        }
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.firebaseAuth.auth.currentUser.sendEmailVerification()
    .then(async () => {
     
      const toast = await this.toastController.create({
        message: 'Te hemos enviado un mail para que verifiques tu correo',
        duration: 5000,
        position: 'top'
      });
      toast.present();  
      
    })
  }

  logout() {
    this.setFCMToken("");
    localStorage.removeItem('user');
    localStorage.removeItem('comercio_seleccionadoId');
    localStorage.removeItem('rol');
    this.authenticationState.next(false); 
       
  }

  

  isAuthenticated() {
    return this.authenticationState.value;
  }

  
  public getActualUser(){
    return JSON.parse(localStorage.getItem('user')); 
  }

  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.firebaseAuth.auth.signInWithCredential(credential)
      .then((response) => {
        this.updateUserData(response.user);        
      }) 
  }

  

  async googleSignin() {
    if (this.platform.is('cordova')) {
      let params;
      if (this.platform.is('android')) {
        params = {
          'webClientId': this.webClientId,
          'offline': true,
          'scopes': 'profile email'
        }
      }
      else {
        params = {}
      }

      console.log(params);
      this.googlePlus.login(params).then((response) => {
        const { idToken, accessToken } = response
        console.log(response);       
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error)
        alert('error:' + JSON.stringify(error));
      });
  
     
  
    } else {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.firebaseAuth.auth.signInWithPopup(provider).then(result => {     
        
        this.updateUserData(result.user); 
      
      
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  }

  getUID(){    
    
    let user =  JSON.parse(localStorage.getItem('user'));
    if(user)
      return user.uid;
    else
      return null;
  }

  getNombre(){    
    let user =  JSON.parse(localStorage.getItem('user'));
    return user.displayName;
  }


  async presentAlert(message) {

    const alert = await this.alertController.create({
      header: 'Completar Campos',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
