import { Component, OnInit, Input } from '@angular/core';
import { PedidoService } from 'src/app/services/global/pedido.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo ="";
  @Input() button ="";
  
  public pedidoActual:any;


  constructor(
    public pedidoService:PedidoService,
    public toastService:ToastService,
    public router:Router,
    private authService:AuthService
  ) { }

  ngOnInit() {

    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    });

  }

  async irCarrito() {
    if(this.pedidoActual.on){
      let subs = this.authService.authenticationState.subscribe(state => {
        if (state) {   
          this.router.navigate(['/form-datos-envio']); 
        }
        else{
          this.toastService.mensaje("","Por favor logueate antes de continuar!");
          this.router.navigate(['login']);
        }
       // if(subs)
         // subs.unsubscribe();
      });
    }
    else
      this.toastService.mensaje("Aún no has hecho pedidos","Busca en todas nuestras opciones y anímate a hacer tu primer pedido")
  }  

}
