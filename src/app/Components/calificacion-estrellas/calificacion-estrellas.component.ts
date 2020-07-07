import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calificacion-estrellas',
  templateUrl: './calificacion-estrellas.component.html',
  styleUrls: ['./calificacion-estrellas.component.scss'],
})
export class CalificacionEstrellasComponent implements OnInit {

  @Input() calificacion:number = 0;
  constructor() { 
    console.log(this.calificacion)
  }

  ngOnInit() {}

}
