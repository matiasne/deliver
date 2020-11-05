import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'form-mis-datos',
    loadChildren: () => import('./form-mis-datos/form-mis-datos.module').then( m => m.FormMisDatosPageModule)
  },
  {
    path: 'form-agregar-pedido',
    loadChildren: () => import('./form-agregar-pedido/form-agregar-pedido.module').then( m => m.FormAgregarPedidoPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'list-comercios',
    loadChildren: () => import('./list-comercios/list-comercios.module').then( m => m.ListComerciosPageModule)
  },
  {
    path: 'list-productos',
    loadChildren: () => import('./list-productos/list-productos.module').then( m => m.ListProductosPageModule)
  },
  {
    path: 'details-comercio',
    loadChildren: () => import('./details-comercio/details-comercio.module').then( m => m.DetailsComercioPageModule)
  },
  
  {
    path: 'form-datos-envio',
    loadChildren: () => import('./form-datos-envio/form-datos-envio.module').then( m => m.FormDatosEnvioPageModule)
  },
  {
    path: 'details-mis-pedidos',
    loadChildren: () => import('./details-mis-pedidos/details-mis-pedidos.module').then( m => m.DetailsMisPedidosPageModule)
  },
  {
    path: 'form-calificacion',
    loadChildren: () => import('./form-calificacion/form-calificacion.module').then( m => m.FormCalificacionPageModule)
  },
  {
    path: 'form-pedido-cadete',
    loadChildren: () => import('./form-pedido-cadete/form-pedido-cadete.module').then( m => m.FormPedidoCadetePageModule)
  },
  {
    path: 'details-terminos-condiciones',
    loadChildren: () => import('./details-terminos-condiciones/details-terminos-condiciones.module').then( m => m.DetailsTerminosCondicionesPageModule)
  },
  {
    path: 'details-preguntas-frecuentes',
    loadChildren: () => import('./details-preguntas-frecuentes/details-preguntas-frecuentes.module').then( m => m.DetailsPreguntasFrecuentesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
