import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input-calificacion',
  templateUrl: './input-calificacion.component.html',
  styleUrls: ['./input-calificacion.component.scss'],
})
export class InputCalificacionComponent implements OnInit {

  @Output() onSelectValue = new EventEmitter<number>();

  public calificacion = 0;

  constructor() { }

  ngOnInit() {}

  setCalification(number){
    this.calificacion = number;
    this.onSelectValue.emit(this.calificacion);
  }
}
