import { Component, OnInit, Input } from '@angular/core';
import { PedidoService } from 'src/app/services/global/pedido.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

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
    public router:Router
  ) { }

  ngOnInit() {

    this.pedidoService.getActualSaleSubs().subscribe(data=>{
      this.pedidoActual = data;
    });

  }

  async irCarrito() {
    if(this.pedidoActual.on)
      this.router.navigate(['/carrito']);
    else
      this.toastService.mensaje("Aún no has hecho pedidos","Busca en todas nuestras opciones y anímate a hacer tu primer pedido")
  }  

}
