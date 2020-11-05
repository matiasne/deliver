import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {

  public email = "";
  constructor(
    private auth:AuthService,
    private router: Router,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }

  recuperarContrasena(){
    this.auth.resetPassword(this.email);
  }

  async presentLoading() {
    this.presentLoading();
    const loading = await this.loadingController.create({
      message: 'Aguarde por favor...',
      duration: 5000
    });
    await loading.present();
  }

}
